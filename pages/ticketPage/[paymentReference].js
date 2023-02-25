import { useCallback,useEffect,useRef,useState } from 'react';
import {Box,Typography,Grid} from '@mui/material'
import Appbar from "../../components/appbar"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { gql } from '@apollo/client';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import jwt from "jsonwebtoken"
import ShareModal from '../../components/ShareModal';
import { LocaleLanguage } from '../../utils/LanguageContext';
import Layout from '../../components/sharedLayout'
import TicketCard from '../../components/displayedTicket';
import rightImage from "../../Assets/images/right.png"
import client from "../../utils/apolloServer"
import { useRouter } from 'next/router';
import ContainedButton from '../../components/Button/containedButton';
import { toPng,toBlob} from 'html-to-image';
import JSZip from 'jszip';
import CircularProgressWithLabel from '../../components/circularProgress';
import { translateWord } from '../../utils/languageTranslation';

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#768463",
        },
    }
})

const ONEANDHALFHOUR = 60*60+60*30

export default function TicketsPage({locale,data,token}){
    const parseDate = (givenDate)=>{
        const amountOfTimeInSeconds = ONEANDHALFHOUR-((Date.now()-parseInt(givenDate))/1000)
        const amountOfTimeLeftInHours = parseInt(amountOfTimeInSeconds/3600)
        const amountOfTimeLeftInMinutes = parseInt((amountOfTimeInSeconds - amountOfTimeLeftInHours*3600)/60)
        const amountOfTimeLeftInSeconds = parseInt((amountOfTimeInSeconds - amountOfTimeLeftInHours*3600)- amountOfTimeLeftInMinutes*60)
        if(amountOfTimeLeftInHours<=0&&amountOfTimeLeftInMinutes<=0){
            return "0:00:00"
        }
        return amountOfTimeLeftInHours+":"+amountOfTimeLeftInMinutes+":"+amountOfTimeLeftInSeconds
    }

    const subtractOneSecond = (time)=>{
        let timeArr = time.split(":").map(val=>parseInt(val))
        if(timeArr[0]>0&&timeArr[1]===0){
            timeArr[0] = timeArr[0]-1
            timeArr[1] = 59
            if(timeArr[1].toString().length===1){
                timeArr[1] = "0"+timeArr[1]
            }
            timeArr[2] = 59
        }
        else if(timeArr[0]<=0&&timeArr[1]<=0){
            timeArr[0] = "0"
            timeArr[1] = "00"
            timeArr[2] = "00"        }
        else{
            if(timeArr[2]==0){
                timeArr[1] = timeArr[1]-1
                timeArr[2] = 59
            }
            else{
                timeArr[2] = timeArr[2]-1
            }
            if(timeArr[1].toString().length===1){
                timeArr[1] = "0"+timeArr[1]
            }
            if(timeArr[2].toString().length===1){
                timeArr[2] = "0"+timeArr[2]
            }
        }
    
        return timeArr[0]+":"+timeArr[1]+":"+timeArr[2]
    }

    const calculatePercentage = ()=>{
        const amountOfTimeElapsed = ((Date.now()-parseInt(data[0]["reservedAt"]))/1000)
        const amountOfTimeLeft = ONEANDHALFHOUR - amountOfTimeElapsed
        return parseInt((amountOfTimeLeft/ONEANDHALFHOUR)*100)
    }

    const [openModal,setOpenModal] = useState(false)
    const router = useRouter()
    const URL = `http://${process.env.NEXT_PUBLIC_APP_HOST}:3000${router.asPath}`
    const useRefArrays = data.map(val=>useRef(null))
    const [timer,setTimer] = useState("")

    const onShareButtonClicked = ()=>{
        setOpenModal(true)
    }

    useEffect(()=>{
        setTimer(parseDate(data[0]["reservedAt"]))
        setInterval(()=>{
            setTimer(prev=>subtractOneSecond(prev))
        },1000)
    },[])

    const getTicketNaming = ()=>{
        if(data[0]["status"]==="RESERVED"){
            return "Unpaid"
        }
        else if(data[0]["status"]==="BOOKED"){
            return "Booked"
        }
        else if(data[0]["status"]==="CANCELLED"){
            return "Cancelled"
        }
        else if(data[0]["status"]==="EXPIRED"){
            return "Expired"
        }
        else{
            return "Travelled"
        }
    }

    const onDownloadButtonClicked = useCallback(async()=>{
        if(useRefArrays.length>0&&useRefArrays[0].current!==null){
            if(useRefArrays.length===1){
                toPng(useRefArrays[0].current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = getTicketNaming()+" Ticket"
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
            }
            else{
                let zip = new JSZip()
                const imageDataArr = []
                let count = 1;
                for(let ref of useRefArrays){
                    const dataURL = await toBlob(ref.current, { cacheBust: true, })
                    zip.file("ticket "+count+".png",dataURL)
                    count++;
                }
                const content = await zip.generateAsync({type:"blob"})
                saveAs(content,getTicketNaming()+" Tickets")
            }
        }
    },[useRefArrays])
    return (<Layout>
        <ThemeProvider theme={customTheme}>
            <LocaleLanguage.Provider value={{locale}}>
            <Box sx={{background:`#fff`,height:"100vh"}}>
                <LocaleLanguage.Provider value={{locale}}>
                <Appbar token={token}/>
                <Box sx={{display:"flex",flexDirection:"column",pt:2,pl:{md:10,xs:4}}}>
                    <Box sx={{display:"flex",justifyContent:"center",alignItems:'center',mb:"1rem"}}>
                        <Image src={rightImage} height={50} width={50}/>
                        <Typography ml={2}>{translateWord(locale,"Your Tickets are Reserved.")}</Typography>
                    </Box>
                    <Grid container sx={{overflow:"auto",display:'flex',width:"100%"}}>
                        <Grid item md={6} xs={12}>
                            {data.map((obj,ind)=><TicketCard key={ind} index={ind} useRef={useRefArrays[ind]} {...obj}/>)}
                        </Grid>
                        <Grid item md={6} xs={12} sx={{display:"grid",py:10,gap:"2rem",justifyContent:"center",position:"relative"}}>
                            <CircularProgressWithLabel label={timer} value={calculatePercentage()}/>
                            <Typography width="70%" position={"absolute"} top={"12rem"} left={{md:"7rem",xs:"3rem"}}>{translateWord(locale,"You have to pay for reserved seat in 1:30 hour, else your reservation will be Canceled.")}</Typography>
                            <ContainedButton width='220px' height='60px' fontSize='20px' onClick={onShareButtonClicked} mt={"2rem"}>
                                <ShareIcon sx={{color:"#fff",mr:"0.5rem"}}/>
                                {translateWord(locale,"Share")}
                            </ContainedButton>
                            <ContainedButton width='220px' height='60px' fontSize='20px' onClick={onDownloadButtonClicked}>
                                <DownloadIcon sx={{color:"#fff",mr:"0.5rem"}}/>
                                {translateWord(locale,"Download")}
                            </ContainedButton>
                        </Grid>
                    </Grid>
                    <Typography sx={{fontWeight:600,fontSize:"20px",color:"#CCCCCC",my:2}}>{translateWord(locale,"Payment Information")}</Typography>
                    <Grid container>
                        <Grid item md={4} xs={4} sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",borderRight:"1px solid #768463"}}>
                            <Typography>{translateWord(locale,"Total")}</Typography>
                            <Typography>{data[0]&&data[0]["price"]*data.length} Birr</Typography>
                        </Grid>
                        <Grid item md={4} xs={4} sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",borderRight:"1px solid #768463"}}>
                            <Typography>{translateWord(locale,"Booking ID")}</Typography>
                            <Typography>{data[0]&&data[0]["referenceID"]}</Typography>
                        </Grid>
                        <Grid item md={4} xs={4} sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                            <Typography>{translateWord(locale,"Account Number")}</Typography>
                            <Typography>{data[0]&&data[0]["bankAccount"]}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <ShareModal open={openModal} setOpen={setOpenModal} url={URL}/>
                </LocaleLanguage.Provider>
            </Box>
            </LocaleLanguage.Provider>
        </ThemeProvider>
    </Layout>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {req,params} = ctx;
    const {paymentReference} = params
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    let token = null;
    if(req["cookies"]['token']){
        token = req["cookies"]['token']
        token = jwt.verify(token,process.env.TOKEN_KEY)
        token = token.role
    }
    try{
            const {data} = await client.query({
                query:gql`
                query reservedTickets($input:String){
                    reservedTickets(referenceID:$input){
                        _id
                        ticketPurchaser
                        passenger{
                            name
                        }
                        bus{
                            busOwner{
                                logo
                                name
                            }
                            plateNumber
                        }
                        bankName
                        bankAccount
                        pickupLocation
                        departure
                        destination
                        date
                        time
                        status
                        price
                        referenceID
                        reservedSeat
                        reservedAt
                    }
                }
                `,
                variables:{
                    input:paymentReference
                }
            })
            console.log(data["reservedTickets"])
            return {props:{locale:nextLocale,
                    data:data["reservedTickets"],token}}
        }
        catch(e){
            return {props:{locale:nextLocale,
                data:[],token}}
        }
}
