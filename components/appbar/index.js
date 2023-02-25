import {useState,useEffect} from 'react';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import {Grid} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Button from "@mui/material/Button"
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import LanguageIcon from '@mui/icons-material/Language';
import { Tooltip} from '@mui/material';
import { useRouter } from 'next/router';
import { io } from "socket.io-client";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookie } from '../../utils/cookies';
import { useLocale } from '../../utils/LanguageContext';
import Link from 'next/link'
import {languages,translateWord,changeLanguage} from '../../utils/languageTranslation';
import { getClientIpLocation } from "../../utils/request-api"
import busLogo from "../../Assets/images/oliveLogo.png"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MenuDialog from '../Callcenter Dialog';

const customTheme = createTheme({
    palette:{
        primary:{
            main:"rgba(0,0,0,0)",
        },
    }
}) 

const imageWidth = 63;
const imageHeight = 50;

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [language,setLanguage] = useState(null)
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const router = useRouter()
  const [getCookie,setCookie,removeCookie] = useCookie()
  const {locale}= useLocale()
  const [socket] = useState(io(`http://${process.env.NEXT_PUBLIC_APP_SERVER}:9000`))
  const [notifications,setNotifications] = useState([])
  const [active,setActive] = useState(false)

  useEffect(()=>{
    async function fetchLanguage(){
      const languageData = await getClientIpLocation()
      if(languageData){
        setCookie("NEXT_LOCALE", languageData['lang'])
      }
    }
    if(!getCookie("NEXT_LOCALE")){
      fetchLanguage()
    }
    if(sessionStorage.getItem("Passengers to Call")){
      setNotifications(JSON.parse(sessionStorage.getItem("Passengers to Call")))
    }
    socket.on("NOTIFY CALL CENTER",(msg)=>{
      setNotifications((prev)=>{
        let newPrev = [...prev]
        newPrev.unshift(JSON.parse(msg))
        sessionStorage.setItem("Passengers to Call",JSON.stringify(newPrev))
        return newPrev;
      })
      setActive(true)
    })
  },[])

  // useEffect(()=>{
  //   if(notifications.length>0){
  //     setActive(true)
  //   }
  // },[notifications])

  const handleOpenUserMenu = (event) => {
    setLanguage(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setLanguage(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = ()=>{
    setAnchorElNav(null);
  }

  const openNotificationList = (event)=>{
    setAnchorElNotification(event.currentTarget)
  }

  const closeNotificationList = ()=>{
    setAnchorElNotification(null)
    setActive(false)
  }

  const goTo = (url) => {
    setAnchorElNav(null);
    router.push(url,router.basePath,{locale:getCookie("NEXT_LOCALE")})
  };

  // const logOut = ()=>{
  //   setAnchorElNav(null);
  //   removeCookie("token")
  //   router.push("/","/")
  // }

  const changeSelectedLanguage = (lang)=>{
    changeLanguage(lang,setCookie)
    handleCloseUserMenu()
  }

  const chooseStyle = (pathName)=>{
    if(router.asPath==="/"&&pathName==="/"){
      return {fontFamily:"Open Sans",textTransform:'none',color:'#768463',fontSize:"20px",fontWeight:700,lineHeight:"27px" }
    }
    else if(router.asPath.includes(pathName)&&pathName!=="/"){
      return {fontFamily:"Open Sans",textTransform:'none',color:'#768463',fontSize:"20px",fontWeight:700,lineHeight:"27px" }
    }
    else {
      return {fontFamily:"Open Sans",textTransform:'none',color:'#768463',fontWeight:400,fontSize:"16px",lineHeight:"21.79px" }
    }
  }

  return (
    <ThemeProvider theme={customTheme}>
    <AppBar position="static" elevation={0} sx={{width:"100vw",borderBottom:"1px solid #ccc"}}>
        <Grid container>
          <Grid item md={4} sx={{display:{xs:"none",md:"flex"}}} pl={10} py={1} alignItems={"center"}>
              <Link href={"/"}>
                <Image src={busLogo.src} alt="My Bus Logo" height={imageHeight} width={imageWidth}/>
              </Link>
          </Grid>
          <Grid item md={4} sx={{display:{md:"flex",xs:"none"},alignItems:"center",justifyContent:"center"}}>
              <Box sx={{ml:"3rem"}}>
                <Button onClick={()=>goTo("/")} style={chooseStyle("/")}>{translateWord(locale,"Find Trip")}</Button>
                <Button onClick={()=>goTo("/myTrips")} style={chooseStyle("/myTrips")}>{translateWord(locale,"Check Trip")}</Button>
                {/* <Button onClick={()=>goTo("/other")} style={chooseStyle("/other")}>{translateWord(locale,"Others")}</Button> */}
              </Box>
          </Grid>
          <Grid item xs={10} pl={4} py={1} sx={{display:{md:"none",xs:"flex"}}}>
            <Link href={"/"}>
                <Image src={busLogo.src} alt='My Bus Logo' height={imageHeight} width={imageWidth}/>
            </Link>
          </Grid>
          <Grid item xs={2} py={1} sx={{display:{xs:"flex",md:"none"}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{color:"#768463"}}/>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={()=>goTo("/")}>
                <Typography textAlign="center">{translateWord(locale,"Find Trip")}</Typography>
              </MenuItem>
              <MenuItem onClick={()=>goTo("/myTrips")}>
                <Typography textAlign="center">{translateWord(locale,"Check Trip")}</Typography>
              </MenuItem> 
            </Menu>
          </Grid>
          <Grid item pl="2rem" md={4} py={1} sx={{display:{md:"flex",xs:"none"},alignItems:"center",justifyContent:"end",pr:"2.5rem"}}>
            <IconButton sx={{mr:"1rem"}} onClick={openNotificationList}>
              <Badge badgeContent={active?" ":null} color='error'>
                <NotificationsNoneOutlinedIcon sx={{color:'#768463'}}/>
              </Badge>
            </IconButton>
            <MenuDialog open={anchorElNotification} handleClose={closeNotificationList} active={active} notifications={notifications}/>
            <Tooltip title={translateWord(locale,"Change Language")}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <LanguageIcon sx={{color:'#768463'}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={language}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(language)}
              onClose={handleCloseUserMenu}
            >
              {languages.map(({lang,locale}) => {
                if(locale!==getCookie('NEXT_LOCALE'))
                return(
                <MenuItem key={locale} onClick={()=>changeSelectedLanguage(locale)}>
                  <Link locale={locale} href={router.asPath} as={router.asPath}><Typography textAlign="center" color={"black"}>{lang}</Typography></Link>
                </MenuItem>
              )
            }
              )
            }
            </Menu>
          </Grid>
        </Grid>
    </AppBar>
    </ThemeProvider>
  );
};
export default ResponsiveAppBar;

