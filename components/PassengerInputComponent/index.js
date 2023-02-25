import { useState,useEffect } from "react";
import { TextField,InputAdornment,Grid,Tooltip, Typography} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SelectPickUpLocation from "../selectBoxPickUpLocation";
import useStateWithCallback from '../../utils/useStateWithCallBack'
import { validateName,validatePhone } from "../../utils/validate";
import { usePassengerInfo } from "../../utils/PassengerInfoContext";
import { translateWord } from "../../utils/languageTranslation";
import { useLocale } from "../../utils/LanguageContext";

const PassengerInputForm = ({index,empty})=>{
    const {availablePickupLocations,
        setPassengerInfo,
        setPassengerNameErrors,
        setPassengerPhoneErrors,
        setSelectedPickupLocation} = usePassengerInfo()
    const [passengerName,setPassengerName] = useStateWithCallback("")
    const [passengerNameError,setPassengerNameError] = useState(false)
    const [passengerPhone,setPassengerPhone] = useStateWithCallback("");
    const [passengerPhoneError,setPassengerPhoneError] = useState(false)
    const [pickUpLocation, setPickUpLocation] = useStateWithCallback(availablePickupLocations["message"]==="NO PICKUP LOCATION"?"":availablePickupLocations[0]);
    const {locale} = useLocale()
    
    useEffect(()=>{
        if(!availablePickupLocations["message"]&&availablePickupLocations["message"]!=="NO PICKUP LOCATION"){
            setSelectedPickupLocation(prev=>{
                let newPrev = [...prev]
                newPrev[index] = availablePickupLocations[0]
                return newPrev
            })
        }
    },[])
    const parseAndStorePassengerInfo = (attr,value)=>{
        setPassengerInfo(prev=>{
            let newPrev = [...prev]
            if(newPrev[index]){
                newPrev[index][attr] = value
            }
            else{
                newPrev[index] = {[attr]:value}
            }
            return newPrev;
        })
    }

    const handleNameChange = (e)=>{
        setPassengerName(e.target.value)
        if(validateName(e.target.value)){
            parseAndStorePassengerInfo("name",e.target.value)
            setPassengerNameError(false)
            setPassengerNameErrors(prev=>{
                let newPrev = [...prev]
                newPrev[index] = false
                return newPrev
            })
        }
        else{
            setPassengerNameError(true)
            setPassengerNameErrors(prev=>{
                let newPrev = [...prev]
                newPrev[index] = true
                return newPrev
            })
        }
    }

    const handlePhoneChange = (e)=>{
        setPassengerPhone(e.target.value)
        if(validatePhone(e.target.value)){
            parseAndStorePassengerInfo("phoneNumber",e.target.value)
            setPassengerPhoneError(false)
            setPassengerPhoneErrors(prev=>{
                let newPrev = [...prev]
                newPrev[index] = false
                return newPrev
            })
        }
        else{
            setPassengerPhoneError(true)
            setPassengerPhoneErrors(prev=>{
                let newPrev = [...prev]
                newPrev[index] = true
                return newPrev
            })
        }
    }

    const handleChange = (event) => {
    setPickUpLocation(event.target.value);
    setSelectedPickupLocation(prev=>{
        let newPrev = [...prev]
        newPrev[index] = event.target.value;
        return newPrev
    })
  };

    return (<Grid container sx={{mb:"2rem"}}>
                <Grid md={4} xs={12} item>
                    <Typography sx={{display:{xs:"block",md:"none"}}}>Passenger'{index+1} Name</Typography>
                    <Tooltip title={passengerNameError?"Please Enter a valid Name":""}>
                        <TextField InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <PersonIcon/>
                                        </InputAdornment>
                                    ),sx:{background:"white",boxShadow: "0px 0px 10px 0px #00000026",width:{md:"325px",xs:"300px"},my:{md:0,xs:"0.5rem"}}
                                }} label={translateWord(locale,"Name")} name="name" id={"name"+index} value={passengerName} onChange={handleNameChange} sx={{display:"block"}} error={(empty&&passengerName==="")||passengerNameError}/>
                    </Tooltip>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Typography sx={{display:{xs:"block",md:"none"}}}>Passenger'{index+1} Phone</Typography>
                    <Tooltip title={passengerPhoneError?"Please Enter a valid phone number":""}>
                    <TextField InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <PhoneIcon/>
                                </InputAdornment>
                            ),
                            sx:{background:"white",boxShadow: "0px 0px 10px 0px #00000026",width:{md:"325px",xs:"300px"},my:{md:0,xs:"0.5rem"}}
                        }} label={translateWord(locale,"Phone Number")} name="phone number" id={"phone number"+index} value={passengerPhone} onChange={handlePhoneChange} sx={{display:"block"}} error={(empty&&passengerPhone==="")||passengerPhoneError}/>
                    </Tooltip>
                </Grid>
        <Grid item md={4} xs={12} sx={{display:availablePickupLocations["message"]!=="NO PICKUP LOCATION"?"block":"none"}}>
            {availablePickupLocations["message"]!=="NO PICKUP LOCATION"&&<Typography sx={{display:{xs:"block",md:"none"}}}>Passenger'{index+1} Pickup Location</Typography>}
            {availablePickupLocations["message"]!=="NO PICKUP LOCATION"&&<SelectPickUpLocation value={pickUpLocation} setValue={handleChange} pickUploactions={availablePickupLocations}/>}
        </Grid>
    </Grid>)
}

export default PassengerInputForm;