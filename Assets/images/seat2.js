import { useState,useEffect } from "react"
import { Typography,Box } from "@mui/material"
import { useSeatInfoContext } from "../../utils/seatPickerContext";
import { usePassengerInfo } from "../../utils/PassengerInfoContext";
import Image from "next/image";
import YellowSeat from "../images/yellowSeat.svg"
import GreenSeat from "../images/greenSeat.svg"
import GreySeat from "../images/greySeat.svg"

const Seat = ({seatNumber,openSnackBar}) => {
  const [status,setStatus] = useState("green")
  const {bookedSeatState} = useSeatInfoContext()
  const {tripId,socket} = usePassengerInfo()

  useEffect(()=>{
    if(bookedSeatState){
      checkStatus()
    }
  },[bookedSeatState])

  const updateReservedSeats = async(seatNumbers)=>{
     socket.emit("reservedSeat",JSON.stringify({
      tripId,
      passenger:localStorage.getItem("USERID"),
      seatNumbers
     }))
  }
  const changeStatus = async()=>{
    const allBookedSeats = Object.values(bookedSeatState[tripId]).reduce((res,cur)=>{
        return [...res,...cur]
    },[])
    const userReservation = bookedSeatState[tripId][localStorage.getItem("USERID")]

    if((userReservation&&!userReservation.includes(seatNumber)&&allBookedSeats.includes(seatNumber))||(!userReservation&&allBookedSeats.includes(seatNumber))){
      openSnackBar()
    }
    else if(userReservation&&userReservation.includes(seatNumber)){
      let reservedSeats = bookedSeatState[tripId][localStorage.getItem("USERID")].filter(st=>st!==seatNumber)
      await updateReservedSeats(reservedSeats)
    }
    else if(!allBookedSeats.includes(seatNumber)){
      let reservedSeats = bookedSeatState[tripId][localStorage.getItem("USERID")]||[]
      updateReservedSeats([...reservedSeats,seatNumber])
    }
    checkStatus()
  }

  const checkStatus = ()=>{
    const allBookedSeats = Object.values(bookedSeatState[tripId]).reduce((res,cur)=>{
      return [...res,...cur]
  },[])
    const userReservation = bookedSeatState[tripId][localStorage.getItem("USERID")]
    if(userReservation&&userReservation.includes(seatNumber)){
        setStatus("yellow")
    }
    else if(allBookedSeats.includes(seatNumber)){
        setStatus("grey")
    }
    else{
        setStatus("green")
    }
  }

  const seatColorChoice = ()=>{
    if(status==="green"){
      return GreenSeat
    }
    else if(status==="yellow"){
      return YellowSeat
    }
    return GreySeat;
  }

  return(<Box sx={{height:{md:"60px",xs:"30px"},width:{md:"60px",xs:"30px"},display:"flex",justifyContent:"center",alignItems:"center",margin:"1rem",position:"relative",cursor:"pointer"}} onClick={changeStatus}>
      <Image src={seatColorChoice()} height={60} width={65}/>
      <Typography fontWeight={"bold"} color="white" sx={{position:"absolute",top:{md:"0.5rem",xs:"0"},cursor:"pointer",fontSize:{md:"16px",xs:"14px"}}}>{seatNumber}</Typography>
  </Box>)
}

export default Seat
