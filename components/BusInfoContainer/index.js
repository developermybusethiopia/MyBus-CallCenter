import { Grid,Typography, Box} from "@mui/material";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { translateWord } from "../../utils/languageTranslation";
import { useLocale } from "../../utils/LanguageContext";
import TimeFormatter from "../../utils/timeFormatter"
import useStateWithCallBack from "../../utils/useStateWithCallBack";
import SeatPicker from "../SeatPicker"
import { SeatInfoContext } from "../../utils/seatPickerContext";
import { useState,useEffect } from "react";
import uuid from "react-uuid";
import { usePassengerInfo } from "../../utils/PassengerInfoContext";
import ContainedButton from "../Button/containedButton";

const BusInfoContainer = ({tripId,busId,departure,destination,name,bookedSeats,price,pickupLocations,departureTime,date})=>{
    const {locale} = useLocale()
    const [open,setOpen] = useStateWithCallBack(false)
    const [bookedSeatState,setBookedSeatsState] = useState({[tripId]:{bookedSeats}})
    const {setReservedSeats,availablePickupLocations,setReservationInfo,setTripId,setAvailablePickupLocations,setPrice,socket,openSeatPicker,openSeatPickerOnClick} = usePassengerInfo()

    useEffect(()=>{
        setPrice([parseInt(price)])
            socket.emit("tripId",JSON.stringify({tripId,bookedSeats}))
            socket.on("UPDATERESERVED",(msg)=>{
            const tripArray = JSON.parse(msg);
            const foundTrip = tripArray.find((obj)=>obj[tripId])
            if(foundTrip){
                setBookedSeatsState({[tripId]:{bookedSeats,...foundTrip[tripId]}})
                setReservedSeats(prev=>{
                    if(!foundTrip[tripId][localStorage.getItem("USERID")]){
                        return [...prev]
                    }
                    const prevClone = prev.filter(trp=>!trp[tripId])
                    prevClone.push({[tripId]:foundTrip[tripId][localStorage.getItem("USERID")]||[]})
                    return prevClone
                    })
            }
        })
    },[tripId,socket])
    useEffect(()=>{
        if(availablePickupLocations.length>0||availablePickupLocations["message"]==="NO PICKUP LOCATION"){
            setOpen(true)
        }
    },[availablePickupLocations])

    useState(()=>{
        socket.emit("reservedSeat",JSON.stringify({
          tripId,
          passenger:localStorage.getItem("USERID"),
          seatNumbers:[]
         }))
      },[])


    const openDialog = ()=>{
        if(!localStorage.getItem("USERID")){
            localStorage.setItem("USERID",uuid())
        }
        socket.emit("tripIdCheck",JSON.stringify({tripId,bookedSeats}))
        socket.on("UPDATERESERVEDCHECK",(msg)=>{
            const tripArray = JSON.parse(msg);
            for(let obj of tripArray){
                let tripKey = Object.keys(obj)[0]
                if(obj[tripKey].hasOwnProperty(localStorage.getItem("USERID"))&&tripKey!==tripId){
                    socket.emit("reservedSeat",JSON.stringify({
                        tripId:tripKey,
                        passenger:localStorage.getItem("USERID"),
                        seatNumbers:[]
                    }))
                    setReservedSeats(prev=>{
                        const prevClone = prev.filter(trp=>!trp[tripId])
                        prevClone.push({[tripId]:[]})
                        return prevClone
                    })
                }
            }
        })
        setTripId(tripId)
        setAvailablePickupLocations(()=>{
            let newPickUp = [...pickupLocations]
            if(newPickUp.length===0){
                return {message:"NO PICKUP LOCATION"}
            }
            return newPickUp})
        setReservationInfo(prev=>{
            return {...prev,busId:busId,time: departureTime,date,departure,destination}
        })
    }
    return (<Grid container sx={{display:"flex",width:{md:"1006px",xs:"100vw"},height:{md:"108px",xs:"auto"},background:"white",justifyContent:"space-between",boxShadow: "0px 0px 10px 0px #00000026",my:{md:"1rem",xs:0}}}>
        <Grid item md={3} xs={6} sx={{display:"flex",alignItems:"center",pl:"2rem"}}>
            <Typography fontWeight={700} fontSize={"20px"}>{translateWord(locale,name)}</Typography>
        </Grid>
        <Grid item md={3} xs={6} sx={{display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
            <Box sx={{display:"flex",my:{md:0,xs:"1rem"}}}>
                <Typography fontWeight={600}>{TimeFormatter(locale,departureTime)}</Typography>
                {departureTime.includes("4")?<DarkModeIcon sx={{ml:"1rem"}}/>:<WbSunnyIcon sx={{ml:"1rem",color:"orange"}}/>}
            </Box>
        </Grid>
        <Grid item md={3} xs={6} sx={{display:"flex",alignItems:"center"}}>
            <Typography sx={{mr:"6.3rem"}}><span style={{fontWeight:700}}>{price}</span> {translateWord(locale,"(ETB)")}</Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{display:{md:"flex",xs:"none"},flexDirection:"column",justifyContent:"center",alignItems:"center",py:"1rem",pr:{md:"1.5rem",xs:0}}}>
            <ContainedButton onClick={openDialog} width={"197px"} height={"60px"} fontSize={"24px"} lineHeight={"32px"}>{translateWord(locale,"Book")}</ContainedButton>
        </Grid>
        <SeatInfoContext.Provider value={{bookedSeatState}}>
                <SeatPicker value={open||openSeatPicker} setValue={setOpen}/>
        </SeatInfoContext.Provider>
    </Grid>)
}

export default BusInfoContainer;