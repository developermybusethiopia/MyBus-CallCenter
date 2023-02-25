import {Grid,Typography} from "@mui/material"
import SelectComponentDefault from "../SelectBox"
import SelectComponent from "../selectBox2"
import { places } from "../../utils/places"
import DatePicker from "../datePicker2"
import {translateWord }from "../../utils/languageTranslation"
import { useLocale } from "../../utils/LanguageContext"
import { usePassengerContext } from "../../utils/PassengerTripContext"

export default function PassengerForm(){
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate()+1)
    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(tomorrowDate.getDate()+1)
    const {locale} = useLocale()
    const {carrier,changeCarrier,
        departure,changeDeparture,
        destination,changeDestination,
        departureDateValue,changeDepartureDate,departureDateError,
        tabIndex,busCompanies} = usePassengerContext()
    
    return <Grid container mt={10} sx={{mt:{md:"5rem",xs:"1rem"},px:{md:10,xs:4},pr:{md:10,xs:0}}}>
        <Grid item md={12} sx={{display:{md:"flex",xs:"none"}}}>
            <Grid container>
                <Grid item md={3}>
                    <Typography>{translateWord(locale,"Carrier")}</Typography>
                </Grid>
                <Grid item md={3}>
                    <Typography>{translateWord(locale,"Departure")}</Typography>
                </Grid>
                <Grid item md={3}>
                    <Typography>{translateWord(locale,"Destination")}</Typography>
                </Grid>
                <Grid item md={3}>
                    <Typography>{translateWord(locale,"Departure Date")}</Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid item pt={2} md={12}>
            <Grid container py={1} sx={{background:"rgba(240, 240, 243, 1)",borderRadius:"5px",boxShadow: "-10px -10px 10px 0px rgba(255, 255, 255, 1)",boxShadow: "-10px -10px 10px 0px rgba(174, 174, 192, 0.2)"
,border:"1px solid #DCDBDB",width:{xs:"83vw"}}} columnSpacing={1}>
                <Grid item md={3}>
                    <Typography sx={{display:{xs:"block",md:'none'}}}>{translateWord(locale,"Carrier")}</Typography>
                    <SelectComponentDefault label={"Carrier"} value={carrier} changeValue={changeCarrier} options={busCompanies} fullwidth={false}/>  
                </Grid>
                <Grid item md={3}>
                        <Typography sx={{display:{xs:"block",md:"none"}}}>{translateWord(locale,"Departure")}</Typography>
                        <SelectComponent label={"Departure"} value={departure} changeValue={changeDeparture} options={places[locale]} fullwidth={false} differentFrom={destination}/>
                </Grid>
                <Grid item md={3}>
                        <Typography sx={{display:{xs:"block",md:'none'}}}>{translateWord(locale,"Destination")}</Typography>
                        <SelectComponent label={"Destination"} value={destination} changeValue={changeDestination} options={places[locale]} fullwidth={false} differentFrom={departure}/>  
                </Grid>
                <Grid item md={3}>
                    <Typography sx={{display:{xs:"block",md:'none'}}}>{translateWord(locale,"Departure Date")}</Typography>
                    <DatePicker value={departureDateValue} changeValue={changeDepartureDate} error={departureDateError} label={translateWord(locale,"Departure Date")}/>
                </Grid>
            </Grid>
        </Grid>
     </Grid>
}