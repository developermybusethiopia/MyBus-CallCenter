import {Box,Grid,Button,Typography} from "@mui/material"
import { usePassengerContext } from "../../utils/PassengerTripContext";

const OverallInfo = ()=>{
    const {carrier,departure,destination,departureDateValue,reservedSeats,price,changeStepper} = usePassengerContext()
    return <Box sx={{position:"fixed",top:"20%",right:"1rem",zIndex:100,width:"440px",height:"396px",background:"#fff",borderRadius:"10px",border:"solid 1px #629460"}}>
        <Typography fontWeight={600} my={"1.5rem"} ml="4rem">Current</Typography>
        <Grid container sx={{pl:"4rem"}} spacing={2}>
            <Grid item md={6}>
                <Typography>Departure</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>{departure}</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>Destination</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>{destination}</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>Date</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>{new Date(departureDateValue).toDateString()}</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>Bus Company</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>{carrier}</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>Seats</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>{reservedSeats.join(", ")}</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>Price</Typography>
            </Grid>
            <Grid item md={6}>
                <Typography>{price*reservedSeats.length}</Typography>
            </Grid>
            <Grid item md={12}>
                <Button variant={"contained"} onClick={()=>changeStepper(0)}>Finish</Button>
            </Grid>
        </Grid>
    </Box>
}

export default OverallInfo;