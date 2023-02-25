import { useState } from "react";
import { Box,Typography,Button,Grid } from "@mui/material";
import Image from "next/image";
import { useMutation,gql } from "@apollo/client";
import PaymentBankCard from "../PaymentBankCard"
import { io } from "socket.io-client";
import { ToastContainer,toast } from "react-toastify";
import { usePassengerInfo } from "../../utils/PassengerInfoContext";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import { translateWord } from "../../utils/languageTranslation";
import { useLocale } from "../../utils/LanguageContext";

const MUTATEUPDATETICKET = gql`
mutation updateTicketInfo($referenceID:ID!,$ticketInfo:UpdateTicketInput!){
    updateTicketInfo(referenceID:$referenceID,ticketInfo:$ticketInfo){
        bankName
        bankAccount
    }
}`

const PaymentInfo = ({banks})=>{
    const {reservedSeats,tripId,price,paymentReference,chosenBank,setChosenBank,changeStepper} = usePassengerInfo()
    const [updateTicket] = useMutation(MUTATEUPDATETICKET)
    const [socket] = useState(io(`http://${process.env.NEXT_PUBLIC_APP_SERVER}:9000`))
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const {locale} = useLocale()

    const goToTicketsPage = async()=>{
        await updateTicket({variables:{
            referenceID:paymentReference,
            ticketInfo:{
                bankName:chosenBank["name"],
                bankAccount:chosenBank["accountNumber"]
            }
        }})
        socket.emit("REMOVE SEAT",JSON.stringify({userID:localStorage.getItem("USERID"),tripID:tripId,ticketInfo:reservedSeats}))
        toast.success("Your Tickets are reserved")
        changeStepper(0)
    }

    const chosenBankBTNClicked = (name,accountNumber)=>{
        sessionStorage.setItem("name",name)
        sessionStorage.setItem("accountNumber",accountNumber)
        setChosenBank({name,accountNumber})
    }
    
    if(!paymentReference){
        return (<Box sx={{fontFamily:"Open Sans",display:"flex",flexDirection:"column",height:"80vh",px:7}}>
                <Typography sx={{fontWeight:600,fontSize:"25px",my:2,textAlign:"center"}}>You have not reserved ticket yet</Typography>
        </Box>)
    }

    const copyContent = async(content)=>{
        await navigator.clipboard.writeText(content)
        setSnackBarOpen(true)
    }

    const handleClose = ()=>{
        setSnackBarOpen(false)
    }

    return (<>
        <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"/>
        <Box sx={{fontFamily:"Open Sans",display:"flex",flexDirection:"column",height:"80vh",px:7}}>
            <Typography sx={{fontWeight:600,my:2}}>{translateWord(locale,"Pay with a convenient payment option for you")}</Typography>
            <Typography sx={{fontWeight:600,mt:3,color:"#ccc"}}>{translateWord(locale,"Choose Bank to Pay with")}</Typography>
            <Box sx={{display:"grid",flexDirection:{md:"row",xs:"column"},gridTemplateColumns:"auto auto auto",mt:"1rem"}}>
                {banks.map(({name,logo,accountNumber})=>(
                    <PaymentBankCard key={name} bankName={name} accountNumber={accountNumber} chosenBank={chosenBank} chooseBank={()=>chosenBankBTNClicked(name,accountNumber)}>
                        <Image src={`http://${process.env.NEXT_PUBLIC_APP_SERVER}:9000/${logo}`} height={58} width={58}/>
                     </PaymentBankCard>
                )
                )}
                <Box sx={{display:chosenBank?"flex":"none",flexDirection:"column",width:{md:"444px",xs:"300px"},p:"1rem",ml:"25rem"}}>
                    <Typography sx={{fontWeight:600,color:"#CCCCCC",mb:"1rem"}}>{translateWord(locale,"Summary")}</Typography>
                    <Grid container>
                        <Grid md={6} xs={6} item>
                            <Typography mb={1}>{translateWord(locale,"Tickets")}</Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            <Typography mb={1}>{reservedSeats.length} </Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            <Typography mb={1}>{translateWord(locale,"Seat No")}</Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            <Typography mb={1}>{reservedSeats.join(", ")}</Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            <Typography mb={1}>{translateWord(locale,"Total")}</Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            {console.log(reservedSeats.length)}
                            {console.log(price)}
                            <Typography mb={1}>{price*reservedSeats.length}{translateWord(locale,"(ETB)")}</Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            <Typography>{translateWord(locale,"Booking ID")}</Typography>    
                        </Grid>
                        <Grid md={6} xs={6} item>
                            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"200px",background:"#fff"}}>
                                <Typography mb={1}>{paymentReference}</Typography>
                                <ContentCopyIcon sx={{color:"#768463",cursor:"pointer"}} onClick={()=>copyContent(paymentReference)}/>
                            </Box>   
                        </Grid>
                        <Grid md={6} xs={6} item sx={{display:"flex",alignItems:"center"}}>
                            <Typography>{chosenBank&&translateWord(locale,chosenBank.name)} </Typography>
                        </Grid>
                        <Grid md={6} xs={6} item sx={{display:"flex",alignItems:"center"}}>
                            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"200px",background:"#fff"}}>
                                <Typography fontWeight={700} fontSize={"25px"}>{chosenBank&&chosenBank.accountNumber}</Typography>  
                                {chosenBank&&chosenBank.accountNumber&&<ContentCopyIcon sx={{color:"#768463",cursor:"pointer"}} onClick={()=>copyContent(chosenBank.accountNumber)}/>}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box sx={{display:chosenBank?"flex":"none",justifyContent:"flex-end",width:"100%"}}>
                <div>
                    <Box>
                        <Typography fontSize={12}>{translateWord(locale,"Copy the Booking ID and use it as a  reason when you make the payment.")}</Typography>
                    </Box>
                    <Box sx={{display:"flex",justifyContent:"flex-end",mt:"2rem"}}>
                        <Button variant="contained" sx={{width:"197px",height:"60px",textTransform:"none",fontWeight:700,fontSize:"20px"}} onClick={goToTicketsPage}>{translateWord(locale,"Finish")}</Button>
                    </Box>
                </div>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
                open={snackBarOpen}
                onClose={handleClose}
                message="The Text Have been Copied"
            />
        </Box>
    </>
    )
}

export default PaymentInfo;