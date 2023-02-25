import { useEffect, useState} from 'react';
import {Box,Typography,Button,TextField,Accordion,AccordionDetails,AccordionSummary} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gql,useMutation} from '@apollo/client'
import Appbar from "../components/appbar"
import { ToastContainer } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import jwt from "jsonwebtoken"
import uuid from "react-uuid";
import { io } from "socket.io-client";
import { useRouter } from 'next/router';
import { LocaleLanguage } from '../utils/LanguageContext';
import Layout from '../components/sharedLayout'
import PassengerInputForm from '../components/PassengerInputComponent';
import PassengerForm from '../components/passengerForm';
import DataTable from '../components/DataTable';
import PaymentInfo from '../components/PaymentInfo';
import { PassengerInfo } from '../utils/PassengerInfoContext';
import client from "../utils/apolloServer"
import SeatPicker from "../components/SeatPicker"
import { validatePhone } from '../utils/validate';
import { translateWord } from '../utils/languageTranslation';
import { PassengerTripContext } from '../utils/PassengerTripContext';
import { SeatInfoContext } from '../utils/seatPickerContext';
import OverallInfo from '../components/TotalInfo';
import { places } from '../utils/places';

const customTheme = createTheme({
    palette:{
        primary:{
            main:"#768463",
        },
    }
})

const MUTATE = gql`
    mutation RegisterUsers($input:[UserCreateInput!]!){
        registerUsers(users:$input){
            _id
            name
            phoneNumber
            active
        }
        }
    `;
const QUERYTRIP = gql`
    query trips($input:TripSearchInput!){
                    trips(trip:$input){
                        departureDate
                        _id
                        bus{
                        _id
                        plateNumber
                        features
                        busOwner{
                            _id
                            name
                            logo
                        }
                        }
                        route{
                        _id
                        departure
                        destination
                        pickupLocations
                        returnPickupLocations
                        price
                        }
                        departure
                        destination
                        departureDate
                        departureTime
                        reservedSeats
                        bookedSeats
                        numberOfAvailableSeats
                        alternativePaths
                    }
                }
`

const MUTATERESERVE = gql`
 mutation reserveTicket($input:CreateTicketInput!){
   reserveTicket(ticket:$input){
     _id
     ticketPurchaser
   passenger{
     name
   }
   pickupLocation
   date
   time
   status
   referenceID
   reservedSeat
   reservedAt
   bookedAt
   expiredAt
   completedAt
   cancelledAt
   }
 }
 `

 const MUTATEREGISTERLOOKINGFORTRIP = gql`
 mutation registerUserLookingForTrip($user:UnsuccessfulSearchInput!){
  registerUserLookingForTrip(user:$user){
     phoneNumber
   }
 }
 `

function TabPanel({ children, value, index,title,handleTabChange}) {
    return (
      <Accordion
        expanded={value === index}
        onChange={handleTabChange(index)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </Accordion>
    );
}


export default function TripResultPage({locale,banks,busCompanies,allTrips,user}){
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate()+1)
    const [carrier,setCarrier] = useState("")
    const [departure,setDeparture] = useState("")
    const [destination,setDestination] = useState("")
    const [departureDateValue,setDepartureDate] = useState(tomorrowDate.getTime())
    const [departureDateError,setDepartureDateError] = useState(false)
    const [RegisterUsers] = useMutation(MUTATE);
    const [reserveTicket] = useMutation(MUTATERESERVE)
    const [tokenAccess] = useState(user?user.role:null)
    const [paymentReference,setPaymentReference] = useState("")
    const [tabIndex,setTabIndex] = useState(0)
    const [availablePickupLocations,setAvailablePickupLocations] = useState([])
    const [selectedPickUpLocation,setSelectedPickupLocation] = useState([])
    const [reservedSeats,setReservedSeats] = useState([])
    const [allFieldsEmpty,setAllFieldsEmpty] = useState(false)
    const [reservationInfo,setReservationInfo] = useState({
      passengerId: [],
      busId:"",
      date: "",
      time: ""
    })
    const [socket] = useState(io(`http://${process.env.NEXT_PUBLIC_APP_SERVER}:9000`))
    const [tripId,setTripId] = useState(null)
    const [passengerInfo,setPassengerInfo] = useState([])
    const [passengerNameErrors,setPassengerNameErrors] = useState([])
    const [passengerPhoneErrors,setPassengerPhoneErrors] = useState([])
    const [price,setPrice] = useState([])
    const [chosenBank,setChosenBank] = useState(null)
    const [phoneNumber,setPhoneNumber] = useState("")
    const [phoneNumberError,setPhoneNumberError] = useState(false)
    const [registerUser] = useMutation(MUTATEREGISTERLOOKINGFORTRIP)
    const router = useRouter()
    const [data,setData] = useState([])
    const [openSeatPicker,setOpenSeatPicker] = useState(false)
    const [tripsData,setTripsData] = useState(allTrips)
    const [bookedSeatState,setBookedSeatsState] = useState()

    const changeStepper = (ind)=>{
      setTabIndex(ind)
    }

    const handleTabChange = (index)=>()=>{
      setTabIndex(index)
    }

    useEffect(()=>{
      router.beforePopState(({as})=>{
        const tripInfo = data.map((obj)=>{
          const reservedSeatsNumbers = obj["reservedSeats"]===null?[]:obj["reservedSeats"];
          const bookedSeatNumbers = obj["bookedSeats"]===null?[]:obj["bookedSeats"]
          return {tripId:obj["_id"],bookedSeats:[...reservedSeatsNumbers,...bookedSeatNumbers]}
        })
        for(let {tripId,bookedSeats} of tripInfo){
          socket.emit("tripIdCheck",JSON.stringify({tripId,bookedSeats}))
          socket.on("UPDATERESERVEDCHECK",(msg)=>{
          const tripArray = JSON.parse(msg);
          for(let obj of tripArray){
          let tripKey = Object.keys(obj)[0]
          if(obj[tripKey].hasOwnProperty(localStorage.getItem("USERID"))){
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
        }
        return true
      })
      return ()=>{
        router.beforePopState(()=>true)
      }
    },[])

    useEffect(()=>{
      if(reservationInfo["busId"]!=="")
      changeStepper(1)
    },[reservationInfo])

    const checkError = ()=>{
      let returnedValue = true
      for(let ind in passengerNameErrors){
          if(passengerNameErrors[ind]){
            returnedValue = false
          }
          if(passengerPhoneErrors[ind]!==undefined&&passengerPhoneErrors[ind]){
            returnedValue = false
          }
      }
      if(passengerInfo.length!==reservedSeats.length){
          setAllFieldsEmpty(true)
          returnedValue = false
      }
      for(let obj of passengerInfo){
            if(!Boolean(obj["name"])||!Boolean(obj["phoneNumber"])){
              setAllFieldsEmpty(true)
              returnedValue = false
            }
      }
      return returnedValue
    }

    const registerUsersClick = async()=>{
      if(checkError()){
        const passengerData = await RegisterUsers({variables:{input:[...passengerInfo]}})
        const passengerIds = passengerData["data"]["registerUsers"].map(({_id})=>_id)
        setReservationInfo(prev=>{
          return {...prev,passengerId:passengerIds}
        })
          const data = await RegisterUsers({variables:{input:[{
            name:passengerInfo[0]["name"],
            phoneNumber:passengerInfo[0]["phoneNumber"],
            role:"TICKET PURCHASER"
        }]}})
      let dataRSrve;
      try{
          dataRSrve = await reserveTicket({variables:{
              input:{
                  ticketPurchaser:data["data"]["registerUsers"][0]["_id"],
                  ...reservationInfo,
                  passengerId:passengerIds,
                  reservedSeats: reservedSeats,pickupLocations:selectedPickUpLocation.length!==0?selectedPickUpLocation:null
                }
              }})
      }
      catch(e){
          console.log(JSON.stringify(e))
      }
      if(passengerInfo&&passengerInfo.length>0){
        changeStepper(3)
        setPaymentReference(dataRSrve["data"]["reserveTicket"][0]["referenceID"])
      }
      }
    }

    const changePhoneNumber = (e)=>{
      setPhoneNumber(e.target.value)
      if(validatePhone(e.target.value.trim())){
        setPhoneNumberError(false)
      }
      else{
        setPhoneNumberError(true)
      }
    }

  const openSeatPickerOnClick = ()=>{
    setOpenSeatPicker(true)
  }

  const findEnglishValue = (input,comparedVal)=>{
    const englishVal = places[locale].find(opt=>opt["name"]===input||opt[opt["name"]]===input)
    if(englishVal){
      return englishVal["name"]
    }
    return comparedVal
  }
  const changeCarrier = (e)=>{
    setCarrier(e.target.value)
    setTripsData(allTrips.filter((obj)=>{
      let departureFilter = departure?findEnglishValue(departure,destination)===obj.departure:true
      let destinationFilter = destination?findEnglishValue(destination,destination)===obj.destination:true
      const dt = obj["date"].split(" ")
      dt.splice(4,2)
      let departureDateFilter = new Date(dt.join(" ")).getTime()===new Date(new Date(departureDateValue).toDateString()).getTime()
      return obj.carrier===e.target.value&&departureFilter&&destinationFilter&&departureDateFilter
    }))
  }

  const changeDeparture = (e,newVal)=>{
    setDeparture(newVal)
    setTripsData(allTrips.filter((obj)=>{
      let carrierFilter = carrier?carrier===obj.carrier:true
      let destinationFilter = destination?findEnglishValue(destination,destination)===obj.destination:true
      const dt = obj["date"].split(" ")
      dt.splice(4,2)
      let departureDateFilter = new Date(dt.join(" ")).getTime()===new Date(new Date(departureDateValue).toDateString()).getTime()
      return obj.departure===findEnglishValue(newVal,obj.departure)&&carrierFilter&&destinationFilter&&departureDateFilter
    }))
  }

  const changeDestination = (e,newVal)=>{
    setDestination(newVal)
    setTripsData(allTrips.filter((obj)=>{
      let departureFilter = departure?findEnglishValue(departure,departure)===obj.departure:true
      let carrierFilter = carrier?carrier===obj.carrier:true
      const dt = obj["date"].split(" ")
      dt.splice(4,2)
      let departureDateFilter = new Date(dt.join(" ")).getTime()===new Date(new Date(departureDateValue).toDateString()).getTime()
      return obj.destination===findEnglishValue(newVal,obj.destination)&&departureFilter&&carrierFilter&&departureDateFilter
    }))
  }

  const changeDepartureDate = (value)=>{
    const date = new Date(value)
    const dateToday = new Date(new Date().toDateString())
    if(date.getTime()>dateToday.getTime()){
      setDepartureDateError(false)
      setDepartureDate(date.getTime())
      setTripsData(allTrips.filter((obj)=>{
        let departureFilter = departure?findEnglishValue(departure,departure)===obj.departure:true
        let destinationFilter = destination?findEnglishValue(destination,destination)===obj.destination:true
        let carrierFilter = carrier?carrier===obj.carrier:true
        const dt = obj["date"].split(" ")
        dt.splice(4,2)
        let departureDateFilter = new Date(dt).getTime()===new Date(new Date(value).toDateString()).getTime()
        return departureFilter&&destinationFilter&&carrierFilter&&departureDateFilter
      }))
    }
    else{
      setDepartureDateError(true)
    }
  }

  const selectTrip = (param)=>{
    const tripId = param["row"]["id"]
    socket.emit("tripId",JSON.stringify({tripId,bookedSeats:param["row"]["bookedSeats"]}))
    socket.on("UPDATERESERVED",(msg)=>{
        const tripArray = JSON.parse(msg);
        const foundTrip = tripArray.find((obj)=>obj[tripId])
        if(foundTrip){
          if(foundTrip[tripId][localStorage.getItem("USERID")]){
            setReservedSeats(foundTrip[tripId][localStorage.getItem("USERID")])
          }
          setBookedSeatsState({[tripId]:{bookedSeats:param["row"]["bookedSeats"],...foundTrip[tripId]}})
        }
    })
    if(!localStorage.getItem("USERID")){
      localStorage.setItem("USERID",uuid())
    }
    socket.emit("tripIdCheck",JSON.stringify({tripId,bookedSeats:param["row"]["bookedSeats"]}))
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
    setDeparture(param["row"]["departure"])
    setDestination(param["row"]["destination"])
    setCarrier(param["row"]["carrier"])
    const dt = param["row"]["date"].split(" ")
    dt.splice(4,2)
    setDepartureDate(new Date(dt.join(" ")).getTime())
    setPrice(param["row"]["price"])
    setTripId(param["row"]["id"])
    setAvailablePickupLocations(()=>{
        let newPickUp = [...param["row"]["pickupLocations"]]
        if(newPickUp.length===0){
            return {message:"NO PICKUP LOCATION"}
        }
        return newPickUp})
    setReservationInfo(prev=>{
      const dt = param["row"]["date"].split(" ")
      dt.splice(4,2)
      return {...prev,busId:param["row"]["busId"],time: param["row"]["departureTime"],date:new Date(dt.join(" ")).getTime().toString(),departure:param["row"]["departure"],destination:param["row"]["destination"]}
    })
    
  }

    return (<Layout>
        <PassengerInfo.Provider value={{
          changeStepper,
        reservedSeats,setReservedSeats,
        reservationInfo,setReservationInfo,
        tripId,setTripId,
        availablePickupLocations,setAvailablePickupLocations,
        selectedPickUpLocation,setSelectedPickupLocation,
        passengerInfo,setPassengerInfo,
        passengerNameErrors,setPassengerNameErrors,
        passengerPhoneErrors,setPassengerPhoneErrors,
        paymentReference,setPaymentReference,
        price,setPrice,
        chosenBank,setChosenBank,
        socket,openSeatPicker,setOpenSeatPicker,openSeatPickerOnClick
        }}>
        <ThemeProvider theme={customTheme}>
            <LocaleLanguage.Provider value={{locale,user}}>
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
            <Box sx={{background:`#F8F8F8`,height:"auto",width:"100vw"}}>
              <Appbar token={tokenAccess}/>
              <PassengerTripContext.Provider value={{carrier,changeCarrier,departure,changeDeparture,destination,changeDestination,departureDateValue,changeDepartureDate,departureDateError,reservedSeats,price,tabIndex,busCompanies,selectTrip,changeStepper}}>
              <TabPanel value={tabIndex} index={0} title={"Departure/Destination Choice"} handleTabChange={handleTabChange}>
                <Typography color={"#4C5048"} fontWeight={700} fontSize={"20px"} mt={"1.5rem"} pl={10} position={"relative"} top={"3rem"}>{translateWord(locale,"Search Trip")}</Typography>
                  <PassengerForm/>
                <Box sx={{px:10}}>
                  <DataTable rowData={tripsData}/>
                </Box>
              </TabPanel>
            <TabPanel value={tabIndex} index={1} title={"Seat Picker"} handleTabChange={handleTabChange}>
                <SeatInfoContext.Provider value={{bookedSeatState}}>
                    <SeatPicker/>
                </SeatInfoContext.Provider>
            </TabPanel>
            <TabPanel value={tabIndex} index={2} title={"Passenger Information"} handleTabChange={handleTabChange}>
              <Box sx={{display:"flex",flexDirection:"column",pl:{md:10,xs:4},py:2}}>
                <Typography sx={{fontWeight:700,fontSize:"20px",color:"#4C5048",mb:"1rem"}}>{translateWord(locale,"Enter Passenger's Information.")}</Typography>
                {reservedSeats.map((seatId,ind)=><PassengerInputForm key={ind} seatId={seatId} index={ind} empty={allFieldsEmpty}/>)}
                <Button variant='contained' onClick={registerUsersClick} sx={{fontFamily:"Open Sans",fontWeight:"700",width:"197px",height:"60px",textTransform:"none",fontSize:"24px",my:5,alignSelf:"start",mr:10}}>{translateWord(locale,"Continue")}</Button>
              </Box>   
            </TabPanel>
            <TabPanel value={tabIndex} index={3} title={"Payment"} handleTabChange={handleTabChange}>
                <PaymentInfo banks={banks}/>
            </TabPanel>
            <OverallInfo/>
            </PassengerTripContext.Provider>
            </Box>
            </LocaleLanguage.Provider>
        </ThemeProvider>
        </PassengerInfo.Provider>
    </Layout>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req} = ctx;
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    const token = req["cookies"]['token']
    let user = null;
    if(token){
        let tokenDecoded = jwt.verify(token,process.env.TOKEN_KEY)
        if(tokenDecoded.role==="TICKET PURCHASER"){
            user = tokenDecoded
        }
    }
    const allTrips = await client.query({
      query:gql`
        query allTrips{
              allTrips{
                _id
                bus{
                  _id
                  busOwner{
                    name
                  }
                }
                departure
                destination
                route{
                  price
                  departure
                  pickupLocations
                  returnPickupLocations
                }
                departureDate
                departureTime
                reservedSeats
                bookedSeats
            }
          }`
    })
  const tripsData = [] 
  for(let trp of allTrips["data"]["allTrips"]){
    const reservedSeatsNumbers = trp["reservedSeats"]===null?[]:trp["reservedSeats"];
    const bookedSeatNumbers = trp["bookedSeats"]===null?[]:trp["bookedSeats"]
    tripsData.push({id:trp["_id"],departure:trp["departure"],destination:trp["destination"],date:new Date(parseInt(trp["departureDate"])).toDateString()+" "+trp["departureTime"],carrier:trp["bus"]["busOwner"]["name"],price:trp["route"]["price"].toString(),pickupLocations:trp["departure"]===trp["route"]["departure"]?trp["route"]["pickupLocations"]:trp["route"]["returnPickupLocations"],departureTime:trp["departureTime"],busId:trp["bus"]["_id"],bookedSeats:[...reservedSeatsNumbers,...bookedSeatNumbers]})
  }
    const allBanks = await client.query({
        query:gql`
        query banks{
              banks{
                name
                accountNumber
                logo
            }
          }`
        })
    const allBusCompanies = await client.query({
      query:gql`
      query busCompanies{
        busCompanies{
              name
          }
        }`
      })
            return {props:{locale:nextLocale||locale,
              banks:allBanks["data"]["banks"],
              allTrips:tripsData,
              busCompanies:allBusCompanies["data"]["busCompanies"].map(({name})=>name),
              user}}
}