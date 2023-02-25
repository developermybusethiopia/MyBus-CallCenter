import { useEffect, useState } from "react";
import {Button,Grid,Box,Typography,SvgIcon,IconButton} from "@mui/material"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from "next/router";
import { useLocale } from "../../utils/LanguageContext";
import { translateWord } from "../../utils/languageTranslation";

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#768463",
        },
    }
})
const ModifySearch = ()=>{
    const [departure,setDeparture] = useState("")
    const [destination,setDestination] = useState("")
    const [date,setDepartureDate] = useState({day:"",month:"",year:""})
    const router = useRouter()
    const {locale} = useLocale()
    useEffect(()=>{
        setDeparture(sessionStorage.getItem("Choose Departure"))
        setDestination(sessionStorage.getItem("Choose Destination"))
        const date = new Date(parseInt(sessionStorage.getItem("Departure Date")))
        setDepartureDate({day:date.getDate(),month:date.getMonth()+1,year:date.getFullYear()})
    },[])

    const swapPlaces = ()=>{
        sessionStorage.setItem("Choose Departure",destination)
        sessionStorage.setItem("Choose Destination",departure)
        const tempDeparture = departure;
        setDeparture(destination)
        setDestination(tempDeparture)
        router.push(`tripResult?departure=${destination}&destination=${departure}&departureDate=${sessionStorage.getItem("Departure Date")}`)
    }
    const goToHomePage = ()=>{
        router.replace("/")
    }
    return(
        <ThemeProvider theme={customTheme}>
        <Grid container sx={{display:"flex",width:{md:"870px",xs:"90%"},height:"72px",alignItems:"center",margin:"0 auto",justifyContent:"center",mt:"1rem",border:{md:"solid 1px #768463",xs:"none"},borderRadius:"5px"}}>
            <Grid item md={3} xs={12} sx={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <Box sx={{display:"flex",width:{md:"75%",xs:"100%"},justifyContent:"center",border:{md:"none",xs:"1px solid #768463"},borderRadius:"5px"}}>
                    <SvgIcon>
                        <FmdGoodIcon/>
                    </SvgIcon>
                    <Typography ml={2}>{translateWord(locale,departure)}</Typography>
                </Box>
                <Box sx={{display:{md:"flex",xs:"none"},alignItems:"center"}}>
                    <IconButton sx={{background:"white",border:"1px solid #768463",height:"30px",width:"30px",position:"relative",left:"1rem",":hover":{background:"white"}}} onClick={swapPlaces}><CompareArrowsIcon/></IconButton>
                    <Box sx={{height:"70px",width:"1px",background:"#768463",display:{md:"flex",xs:"none"}}}></Box>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{display:{md:"none",xs:"flex"},justifyContent:"center",my:"0.5rem",width:"100vw"}}>
                <IconButton sx={{background:"white",border:"1px solid #768463",height:"30px",width:"30px",position:"relative",transform:"rotate(90deg)",":hover":{background:"white"}}} onClick={swapPlaces}><CompareArrowsIcon/></IconButton>
            </Grid>
            <Grid item md={3} xs={12} sx={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <Box sx={{display:"flex",width:{md:"75%",xs:"100%"},borderRadius:"5px",justifyContent:"center",border:{md:"none",xs:"1px solid #768463"}}}>
                    <SvgIcon>
                        <FmdGoodIcon/>
                    </SvgIcon>
                    <Typography ml={2}>{translateWord(locale,destination)}</Typography>
                </Box>
                <Box sx={{display:{md:"flex",xs:"none"}}}>
                    <Box sx={{height:"70px",width:"1px",background:"#768463"}}></Box>
                </Box>
            </Grid>
            <Grid item md={6} xs={12} sx={{display:"flex",alignItems:"center",}}>
                <Box sx={{display:{md:"flex",xs:"block"},justifyContent:"space-between",width:"100%",alignItems:"center",px:{md:"1rem",xs:0}}}>
                    <Box sx={{display:"flex",border:{xs:"1px solid #768463",md:"none"},borderRadius:"5px",justifyContent:"center",my:"1rem"}}>
                        <SvgIcon>
                            <CalendarMonthIcon/>
                        </SvgIcon>
                        <Typography sx={{ml:"1rem"}}>{`${date.day}-${date.month}-${date.year}`}</Typography>
                    </Box>
                    <Button variant="outlined" sx={{textTransform:"none"}} onClick={goToHomePage}>{translateWord(locale,"Modify Search")}</Button>
                </Box>
            </Grid>
        </Grid>
    </ThemeProvider>
    )
}

export default ModifySearch;