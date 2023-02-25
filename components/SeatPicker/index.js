import { useState } from 'react';
import { Box,Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import YellowSeat from "../../Assets/images/yellowSeat.svg"
import GreySeat from "../../Assets/images/greySeat.svg"
import GreenSeat from "../../Assets/images/greenSeat.svg"
import Seat from "../../Assets/images/seat2"
import { usePassengerInfo } from '../../utils/PassengerInfoContext';
import ContainedButton from '../Button/containedButton';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';

export default function CustomizedDialogs() {
  const [open,setOpen] = useState(false)
  const [openSnackSeatNotSelected,setOpenSnackSeatNotSelected] = useState(false)
  const {changeStepper,reservedSeats,setReservedSeats,tripId,price,setOpenSeatPicker} = usePassengerInfo()
  const {locale} = useLocale()

  const openSnackBar = ()=>{
    setOpen(true)
  }

  const closeSnackBar = ()=>{
    setOpen(false)
  }

  const closeSnackSeatNotSelected = ()=>{
    setOpenSnackSeatNotSelected(false)
  }

  const goToPassengerInfo = ()=>{
    if(reservedSeats.length>=1){
      changeStepper(2)
    }
    else{
      setOpenSnackSeatNotSelected(true)
    }
  }

  return (
        <Box>
        <Typography>{translateWord(locale,"Select your Seats")}</Typography>
        <Box dividers sx={{width:{md:"810px",xs:"300px"}}}>
          <Grid container>
            <Grid item md={5} sx={{position:"relative"}}>
              <Box sx={{position:"fixed",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <Typography sx={{display:{md:"block",xs:"none"}}}>{reservedSeats.find((obj)=>obj[tripId])&&reservedSeats.find((obj)=>obj[tripId])[tripId].length} {translateWord(locale,"Seat(s) Selected")}</Typography>
                  <Box sx={{position:"fixed",width:"25%",height:"200px",overflowY:"auto",mt:"2rem",display:{md:"block",xs:"none"}}}>
                      {reservedSeats.find((obj)=>obj[tripId])&&reservedSeats.find((obj)=>obj[tripId])[tripId].map((st,ind)=>{
                        return (<Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"15rem",my:"0.5rem"}}>
                            <Typography>{translateWord(locale,"Passenger")} {ind+1}</Typography>
                            <Typography>{st}</Typography>
                          </Box>)
                      })}
                  </Box>
              <Box sx={{position:"fixed",height:"25rem",top:"24rem",width:"18%",display:{md:"block",xs:"none"}}}>
                <Typography>{translateWord(locale,"Symbols")}</Typography>
                <Box sx={{display:"flex",alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={YellowSeat} height={45} width={45}/>
                  <Typography ml={"2rem"}>{translateWord(locale,"Reserved Seat")}</Typography>
                </Box>
                <Box sx={{display:"flex",alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreenSeat} height={45} width={45}/>
                  <Typography ml={"2rem"}>{translateWord(locale,"Available Seat")}</Typography>
                </Box>
                <Box sx={{display:"flex",alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreySeat} height={45} width={45}/>
                  <Typography ml={"2rem"}>{translateWord(locale,"Unavailable Seat")}</Typography>
                </Box>
              </Box>
              </Box>
            </Grid>
            <Grid item md={7} xs={12}>
              <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <Typography sx={{display:{md:"none",xs:"flex"}}}>Symbols</Typography>
                <Box sx={{display:{md:"none",xs:"flex"},alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={YellowSeat} height={30} width={30}/>
                  <Typography ml={"2rem"} fontSize={"14px"}>{translateWord(locale,"Reserved Seat")}</Typography>
                </Box>
                <Box sx={{display:{md:"none",xs:"flex"},alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreenSeat} height={30} width={30}/>
                  <Typography ml={"2rem"} fontSize={"14px"}>{translateWord(locale,"Available Seat")}</Typography>
                </Box>
                <Box sx={{display:{md:"none",xs:"flex"},alignItems:"center",width:"100%",my:"0.5rem"}}>
                  <Image src={GreySeat} height={30} width={30}/>
                  <Typography ml={"2rem"} fontSize={"14px"}>{translateWord(locale,"Unavailable Seat")}</Typography>
                </Box>
              <Box sx={{display:{md:"flex",xs:"none"},justifyContent:"flex-end",position:"relative",left:{md:0,xs:"1.8rem"}}}>
                  <Seat seatNumber={"3"} openSnackBar={openSnackBar}/>
                  <Seat seatNumber={"4"} openSnackBar={openSnackBar}/>
              </Box>
              <SeatGrouper>
                    <Seat seatNumber={"1"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"2"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"7"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"8"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"5"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"6"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"12"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"11"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"9"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"10"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"16"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"15"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"13"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"14"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"20"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"19"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"17"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"18"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"24"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"23"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"21"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"22"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"28"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"27"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"25"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"26"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"29"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"30"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"32"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"31"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"33"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"34"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"36"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"35"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"37"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"38"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"40"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"39"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"41"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"42"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"44"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"43"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
              <SeatGrouper>
                    <Seat seatNumber={"45"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"46"} openSnackBar={openSnackBar}/> 
                    <Seat seatNumber={"49"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"48"} openSnackBar={openSnackBar}/>
                    <Seat seatNumber={"47"} openSnackBar={openSnackBar}/> 
              </SeatGrouper>
            </Box>
            </Grid>
            </Grid>
        </Box>
        <Box sx={{display:"flex",justifyContent:reservedSeats.find((obj)=>obj[tripId])?"space-between":"flex-end"}}>
         {reservedSeats.find((obj)=>obj[tripId])&&<Box sx={{display:"flex",alignItems:"center"}}><Typography fontWeight={700} ml={"1rem"}>{parseInt(price[0])*reservedSeats.find((obj)=>obj[tripId])[tripId].length+" "}</Typography> {translateWord(locale,"(ETB)")}</Box>}
         <ContainedButton onClick={goToPassengerInfo}>
            {translateWord(locale,"Confirm Seat")}
          </ContainedButton>
        </Box>
        <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"center"}} open={open} onClose={closeSnackBar} message="The Selected Seat is not available"/>
        <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"center"}} open={openSnackSeatNotSelected} onClose={closeSnackSeatNotSelected} message="Please Select at least one Seat"/>
      </Box>
  );
}

const SeatGrouper = ({children})=>{
  return (
  <Box sx={{display:"flex",justifyContent:'space-between'}}>
    <Box sx={{display:"flex"}}>
        {children[0]}
        {children[1]}
    </Box>
  <Box sx={{ml:{md:children.length===5?0:"5rem",xs:children.length===5?0:"3rem"}}}>
      <Box sx={{display:"flex"}}>
      {children[2]}
      {children[3]}
      {children[4]}
      </Box>
  </Box>
</Box>)
}