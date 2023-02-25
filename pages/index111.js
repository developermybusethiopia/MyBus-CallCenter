import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState,useEffect } from 'react'
import { Grid,Box,ThemeProvider,createTheme } from '@mui/material'
import jwt from 'jsonwebtoken'
import {Typography} from '@mui/material'
import ResponsiveAppBar from "../components/appbar"
import PassengerForm from "../components/passengerForm"
import { LocaleLanguage } from '../utils/LanguageContext'
import { translateWord } from '../utils/languageTranslation'
import { places,popularRoutes} from '../utils/places'
import Layout from '../components/sharedLayout'
import ImageCard from '../components/ImageCard'
import { PassengerTripContext } from '../utils/PassengerTripContext'
import { getClientIpLocation } from '../utils/request-api'
import Image from 'next/image'
import BusBackground from "../Assets/images/busBackgroundImage.svg"
import SearchField from '../components/SearchBar'

const customTheme = createTheme({
  palette:{
      primary:{
          main:"#768463",
      },
  }
})

export default function Home({locale,user,token}) {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate()+1)
    const [departure,setDeparture] = useState("")
    const [departureError,setDepartureError] = useState(false)
    const [destination,setDestination] = useState("")
    const [destinationError,setDestinationError] = useState(false)
    const [departureDateValue,setDepartureDate] = useState(tomorrowDate.getTime())
    const [departureDateError,setDepartureDateError] = useState(false)
    const [offSet,setOffset] = useState(0)

    const filterSearchResult = (destination)=>{
      setDestination(destination)
      if(departure===""||departureDateValue===""){
          departure===""?setDepartureError(true):setDepartureError(false)
          !departureDateValue?setDepartureDateError(true):setDepartureDateError(false)
          return
      }
      else if(departureError||departureDateError){
          return
      }
      sessionStorage.removeItem("Choose Departure")
      sessionStorage.removeItem("Choose Destination")
      sessionStorage.removeItem("Departure Date",departureDateValue)
      sessionStorage.setItem("Choose Departure",departure)
      sessionStorage.setItem("Choose Destination",destination)
      sessionStorage.setItem("Departure Date",departureDateValue)
  }

    useEffect(()=>{
      sessionStorage.removeItem("reservedSeats")
      sessionStorage.removeItem("reservationInfo")
      sessionStorage.removeItem("pickUpLocation")
      sessionStorage.removeItem("selectedPickUpLocations")
      async function fetchCity(){
            const cityData = await getClientIpLocation()
            if(cityData&&cityData["city"]){
                const thereIs = places[locale].find(plc=>plc.name===cityData["city"])
                if(thereIs){
                    sessionStorage.setItem("Choose Departure",destination)
                    setDeparture(cityData["city"])
                }
            }
    }
    fetchCity()
  },[])
 
  return (<Layout>
    <ThemeProvider theme={customTheme}>
    <Box sx={{background: "#F8F8F8",height:{md:"100vh",xs:"auto"},width:"100vw"}}>
      <Head>
        <title>My Bus</title>
        <meta name="description" content="My Bus is an online bus ticketing app" />
        <meta name="keywords" content='Online Bus Ticketing, Bus Booking'/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <LocaleLanguage.Provider value={{locale,user}}>
        <ResponsiveAppBar token={token}/>
        <Grid container sx={{position:"relative"}}>
          <Grid item md={12} display={"flex"} mt={5} sx={{pl:{md:10,xs:4},pr:{md:7,xs:4}}} justifyContent={"space-between"} alignItems={"center"}>
            <Box sx={{display:"flex"}}>
              <Typography fontFamily={"Open Sans"} fontWeight="600" color={"black"} sx={{fontSize:{md:"36px",xs:"16px"},lineHeight:{md:"49px",xs:"20px"}}}>{translateWord(locale,"MyBus, easiest way to")}</Typography>
              <Typography fontFamily={"Open Sans"} fontWeight="800" color={"#768463"} sx={{ml:"1rem",fontSize:{md:"36px",xs:"16px"},lineHeight:{md:"49px",xs:"20px"}}}>{translateWord(locale,"book your Trip.")}</Typography>
            </Box>
            {/* <SearchField/> */}
          </Grid>
          <Box sx={{position:"absolute",textAlign:"right",width:"100vw",ml:{md:"4rem",xs:0}}}>
            <Image src={BusBackground} height={"424px"} width={"758px"}/>
          </Box>
          <Grid item md={12}>
            <PassengerTripContext.Provider value={{departure,setDeparture,departureError,setDepartureError,destination,setDestination,destinationError,setDestinationError,departureDateValue,setDepartureDate,departureDateError,setDepartureDateError}}>
              <PassengerForm />
            </PassengerTripContext.Provider>
          </Grid>
          <Grid item md={12} mt={"3rem"} sx={{px:{md:10,xs:4}}}>
            <Typography sx={{fontWeight:700,fontSize:"20px",color:"#ccc"}}>{translateWord(locale,"Popular Destinations")}</Typography>
            <Box onMouseMove={(e)=>{
                    const btnContainer = document.querySelector(`.btnContainer`)
                    const deviceWidth = document.body.clientWidth
                    if(deviceWidth/2>e.pageX&&offSet>0){
                        setOffset(prev=>{
                          btnContainer.scroll({left:prev-10,behavior:"smooth"})
                          return prev-10})
                    }
                    else if(deviceWidth/2<e.pageX&&offSet<btnContainer.scrollWidth){
                        setOffset(prev=>{
                          btnContainer.scroll({left:prev+10,behavior:"smooth"})
                          return prev+10})
                    }
                }} className={`btnContainer`} sx={{overflow:{md:"hidden",xs:"scroll"},display:'flex',flexShrink:0,mt:"2rem",py:"1rem",width:"83vw"}}>
                {popularRoutes[locale].map((plc,ind)=>{
                    if(departure!==plc["name"]){
                        return <ImageCard key={ind} label={plc[plc["name"]]} onClick={()=>filterSearchResult(plc["name"])} img={plc["img"]&&plc["img"].src}/>
                    }
                })}
                </Box>
          </Grid>
        </Grid>
        </LocaleLanguage.Provider>
    </Box>
    </ThemeProvider>
  </Layout>
  )
}
export const getServerSideProps = (ctx)=>{
  const {locale,req} = ctx;
  const nextLocale = req["cookies"]['NEXT_LOCALE']
  let token = null;
  if(req["cookies"]['token']){
    token = req["cookies"]['token']
    token = jwt.verify(token,process.env.TOKEN_KEY)
    token = token.role
  }
  return {props:{locale:nextLocale||locale,token}}
}