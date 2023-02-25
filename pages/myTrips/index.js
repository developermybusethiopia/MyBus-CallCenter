import { useEffect, useState } from 'react';
import {Box,Typography, TextField} from '@mui/material'
import Appbar from "../../components/appbar"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { gql,useMutation } from '@apollo/client';
import jwt from "jsonwebtoken"
import { LocaleLanguage } from '../../utils/LanguageContext';
import Layout from '../../components/sharedLayout'
import client from "../../utils/apolloServer"
import ContainedButton from '../../components/Button/containedButton';
import TripCard from '../../components/CustomCard/TripCard';
import { translateWord } from '../../utils/languageTranslation';

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#768463",
        },
    }
})

const MUTATETICKETSEARCH = gql`
 mutation searchWithBookingCode($bookingCode:String!){
    searchWithBookingCode(bookingCode:$bookingCode){
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
                }
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
 }`

export default function TicketsPage({locale,data,token,query}){
    const [ticketsList,setTicketList] = useState([])
    const [bookingCode,setBookingCode] = useState(query||"")
    const [fetchTickets] = useMutation(MUTATETICKETSEARCH)

    useEffect(()=>{
        setTicketList(data)
    },[data])
    const onBookingCodeChange = async(e)=>{
        setBookingCode(e.target.value)
    }

    const onSearchClicked = async()=>{
        const fetchedData = await fetchTickets({variables:{
            bookingCode
        }})
        let categorizedTrip = []
            for(let trp of fetchedData["data"]["searchWithBookingCode"]){
                let ind = categorizedTrip.findIndex((({bookingID})=>bookingID===trp["referenceID"]))
                if(ind>=0){
                    categorizedTrip[ind]['count'] = categorizedTrip[ind]['count']+1
                    categorizedTrip[ind]['foundTickets'] = [...categorizedTrip[ind]['foundTickets'],trp]
                }
                else{
                    categorizedTrip.push({count:1,departure:trp.departure,destination:trp.destination,foundTickets:[trp],bookingID:trp.referenceID,departureDate:trp.date,status:trp.status,reservedAt:trp.reservedAt})
                }
            }
        setTicketList(categorizedTrip)
    }

    return (<Layout>
        <ThemeProvider theme={customTheme}>
            <Box sx={{background:`#fff`,height:"auto"}}>
                <LocaleLanguage.Provider value={{locale}}>
                <Appbar token={token}/>
                <Box sx={{display:"flex",flexDirection:"column",pt:2,pl:{md:10,xs:4}}}>
                   <Typography variant="h5" fontWeight={600} color={"#00000099"} mt={"3rem"}>{translateWord(locale,"Check Your Bookings")}</Typography>
                   <Typography fontWeight={600} color={"#CCCCCC"} my={"1rem"}>{translateWord(locale,"Booking Code")}</Typography>
                <Box sx={{boxShadow:"-10px -10px 30px 0px #FFFFFF,-10px -10px 30px 0px #AEAEC066",width:{md:"771px",xs:"350px"},height:"auto",background:"#F0F0F3",borderRadius:"6.5px",display:"flex",flexDirection:{md:"row",xs:"column"},alignItems:{md:"center",xs:"start"},justifyContent:"space-between",p:"1rem"}}>
                    <TextField 
                    InputProps={{style:{width:{md:"460px",xs:"300px"},height:"80px",boxShadow:"-10px -10px 30px 0px #FFFFFF,10px 10px 30px 0px #AEAEC066,10px 10px 10px 0px #AEAEC040 inset,-10px -10px 10px 0px #FFFFFF inset"}}}
                    sx={{width:{md:"460px",xs:"300px"},height:"80px",background:"#fff",my:"0.5rem"}} placeholder="Enter Booking Code" value={bookingCode} onChange={onBookingCodeChange}/>
                    <ContainedButton width='200px' height='60px' fontSize='20px' onClick={onSearchClicked}>
                        {translateWord(locale,"Search")}
                    </ContainedButton>
                </Box>
                <Typography variant="h5" fontWeight={600} color={"#00000099"} mt={"3rem"} mb={"1rem"}>{translateWord(locale,"Activity")}</Typography>
                {ticketsList.map((obj,ind)=>{
                   return <TripCard key={ind} {...obj}/>
                })}
                </Box>
                </LocaleLanguage.Provider>
            </Box>
        </ThemeProvider>
    </Layout>
    )
}
export const getServerSideProps = async(ctx)=>{
    const {locale,req,query} = ctx;
    const searchValue = query.query
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    let token = null;
    let id;
    let categorizedTrip = []
    if(req["cookies"]['token']){
        token = req["cookies"]['token']
        token = jwt.verify(token,process.env.TOKEN_KEY)
        id = token._id
        token = token.role
    }
    try{
            if(searchValue){
                const {data} = await client.query({
                    query:gql`
                    query searchTicket($searchValue:String!){
                        searchTicket(searchValue:$searchValue){
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
                            }
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
                        searchValue:searchValue
                    }
                })
                for(let trp of data["searchTicket"]){
                    let ind = categorizedTrip.findIndex((({bookingID})=>bookingID===trp["referenceID"]))
                    if(ind>=0){
                        categorizedTrip[ind]['count'] = categorizedTrip[ind]['count']+1
                        categorizedTrip[ind]['foundTickets'] = [...categorizedTrip[ind]['foundTickets'],trp]
                    }
                    else{
                        categorizedTrip.push({count:1,departure:trp.departure,destination:trp.destination,foundTickets:[trp],bookingID:trp.referenceID,departureDate:trp.date,status:trp.status,reservedAt:trp.reservedAt})
                    }
                }
            }
            return {props:{locale:nextLocale||locale,
                    data:categorizedTrip,token,query:searchValue||null}}
        }
        catch(e){
            return {props:{locale:nextLocale||locale,
                data:[],token,query:searchValue||null}}
        }
}