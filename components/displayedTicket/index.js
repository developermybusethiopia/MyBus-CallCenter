import {Box,Grid,Typography} from "@mui/material"
import Image from "next/image"
import WhiteLogo from "../../Assets/images/oliveLogo.png"
import { useLocale } from "../../utils/LanguageContext"
import { translateWord } from "../../utils/languageTranslation"

const TicketCard = (props)=>{
    const {locale} = useLocale()
    const passedDate = new Date(parseInt(props["date"]))
    return (<Box ref={props.useRef} sx={{py:2,flexShrink:0,px:5,mb:"0.7rem",width:{md:"650px",xs:"320px"},height:{md:"375px",xs:"auto"},background:"#E5E7E2",position:"relative",cursor:"pointer"}}>
                <Box sx={{display:"flex",justifyContent:"space-between"}}>
                    <Image src={`http://${process.env.NEXT_PUBLIC_APP_SERVER}:9000/${props["bus"]["busOwner"]["logo"]}`} height={40} width={40}/>
                    <Typography>{translateWord(locale,"Passenger's Ticket")}</Typography>
                    <Image src={WhiteLogo.src} height={31.5} width={40}/>
                </Box>
                <Box sx={{height:"1px",width:"100%",border:"1px solid #768463",my:"1rem"}}></Box>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <PassengerInfoComponent label={translateWord(locale,"Passenger's Name")} value={props["passenger"]["name"]}/>
                        <PassengerInfoComponent label={translateWord(locale,"Departure")} value={props["departure"]}/>
                        <PassengerInfoComponent label={translateWord(locale,"Departure Date")} value={`${passedDate.getDate()}-${passedDate.getMonth()+1}-${passedDate.getFullYear()}`}/>
                        <PassengerInfoComponent label={translateWord(locale,"Departure Time")} value={props["time"]}/>
                        <PassengerInfoComponent label={translateWord(locale,"Booking ID")} value={props["referenceID"]}/>
                        <PassengerInfoComponent label={translateWord(locale,props["bankName"])} value={props["bankAccount"]}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <PassengerInfoComponent label={translateWord(locale,"Ticket ID")} value={props["_id"].substring(props["_id"].length-5)}/>
                        <PassengerInfoComponent label={translateWord(locale,"Destination")} value={props["destination"]}/>
                        {props["pickupLocation"]&&<PassengerInfoComponent label={translateWord(locale,"Pickup Location")} value={props["pickupLocation"]}/>}
                        <PassengerInfoComponent label={translateWord(locale,"Seat No")} value={props["reservedSeat"]}/>
                        <PassengerInfoComponent label={translateWord(locale,"Ticket Fee")} value={props["price"]+" Birr"}/>
                        <PassengerInfoComponent label={translateWord(locale,"Bus Plate No.")} value={props["bus"]["plateNumber"]}/>
                    </Grid>
                </Grid>
                <Box sx={{height:{md:"375px",xs:"840px"},position:"absolute",top:0,bottom:0,right:"1.7rem",width:"6px",background:"#768463"}}></Box>
                <Box sx={{display:"flex",justifyContent:"flex-end",pr:10}}>
                    <Typography fontWeight={700} fontSize={"20px"} sx={{color:props["status"]==="RESERVED"?"#CC0707":"green"}}>{props["status"]==="RESERVED"?"Unpaid":"Paid"}</Typography>
                </Box>
        </Box>)
}

const PassengerInfoComponent = ({label,value})=>{
    return (<Grid container sx={{my:2}}>
        <Grid item md={6} xs={12}>
            {label}
        </Grid>
        <Grid item md={6} xs={12} sx={{fontWeight:600}}>
            {value}
        </Grid>
    </Grid>)
}

export default TicketCard