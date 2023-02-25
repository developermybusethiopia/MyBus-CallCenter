import { useState,useCallback,useRef } from 'react';
import {Box,Typography,Grid} from '@mui/material'
import Appbar from "../../components/appbar"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { gql } from '@apollo/client';
import jwt from "jsonwebtoken"
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import { LocaleLanguage } from '../../utils/LanguageContext';
import Layout from '../../components/sharedLayout'
import TicketCard from '../../components/displayedTicket';
import client from "../../utils/apolloServer"
import ContainedButton from '../../components/Button/containedButton';
import ShareModal from '../../components/ShareModal';
import { useRouter } from 'next/router';
import { toPng,toBlob} from 'html-to-image';
import JSZip from 'jszip';
import {saveAs} from "file-saver"
import { translateWord } from '../../utils/languageTranslation';

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#768463",
        },
    }
})

export default function TicketsPage({locale,data,token}){
    const [openModal,setOpenModal] = useState(false)
    const router = useRouter()
    const URL = `http://${process.env.NEXT_PUBLIC_APP_HOST}:3000${router.asPath}`
    const useRefArrays = data.map(val=>useRef(null))

    const onShareButtonClicked = ()=>{
        setOpenModal(true)
    }

    const getTicketNaming = ()=>{
        if(data[0]["status"]==="RESERVED"){
            return translateWord(locale,"Unpaid")
        }
        else if(data[0]["status"]==="BOOKED"){
            return translateWord(locale,"Booked")
        }
        else if(data[0]["status"]==="CANCELLED"){
            return translateWord(locale,"Cancelled")
        }
        else if(data[0]["status"]==="EXPIRED"){
            return translateWord(locale,"Expired")
        }
        else{
            return translateWord(locale,"Travelled")
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
            <Box sx={{background:`#fff`,height:"100vh"}}>
                <LocaleLanguage.Provider value={{locale}}>
                <Appbar token={token}/>
                <Box sx={{display:"flex",flexDirection:"column",pt:2,pl:10}}>
                    <Typography variant="h5" fontWeight={600} color={"#00000099"} mt={"3rem"} mb={"2rem"}>{getTicketNaming()}</Typography>
                    <Grid container>
                        <Grid item md={6} sx={{display:'flex',flexDirection:"column",width:"auto"}}>
                            {data.map((obj,ind)=><TicketCard key={ind} index={ind} useRef={useRefArrays[ind]} {...obj}/>)}
                        </Grid>
                        <Grid item md={6} sx={{display:"grid",py:10,gap:0,justifyContent:"center",alignItems:"center"}}>
                            <ContainedButton width='220px' height='60px' fontSize='20px' onClick={onShareButtonClicked}>
                                <ShareIcon sx={{color:"#fff",mr:"0.5rem"}}/>
                                {translateWord(locale,"Share")}
                            </ContainedButton>
                            <ContainedButton width='220px' height='60px' fontSize='20px' onClick={onDownloadButtonClicked}>
                                <DownloadIcon sx={{color:"#fff",mr:"0.5rem"}}/>
                                {translateWord(locale,"Download")}
                            </ContainedButton>
                        </Grid>
                    </Grid>
                </Box>
                <ShareModal open={openModal} setOpen={setOpenModal} url={URL}/>
                </LocaleLanguage.Provider>
            </Box>
        </ThemeProvider>
    </Layout>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {req,params} = ctx;
    const {bookingID} = params
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
                    }
                }
                `,
                variables:{
                    input:bookingID
                }
            })
            return {props:{locale:nextLocale,
                    data:data["reservedTickets"],token}}
        }
        catch(e){
            return {props:{locale:nextLocale,
                data:[],token}}
        }
}