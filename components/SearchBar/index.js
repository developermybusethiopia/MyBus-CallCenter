import { useState } from "react"
import {Box,TextField,Typography,Grid} from "@mui/material"
import { useRouter } from "next/router"
import SearchIcon from "../../Assets/images/SearchIcon.svg"
import Image from "next/image"

const SearchField = ()=>{
    const [searchValue,setValue] = useState("")
    const router = useRouter()

    const onChange = (e)=>{
        setValue(e.target.value)
    }

    const onSearchBtnClicked = async()=>{
        await router.push(`/myTrips?query=${searchValue}`)
    }
    return (<Box sx={{py:"0.5rem",width:"522px",zIndex:10}}>
        <Typography sx={{color:"#ccc"}} mb={"0.5rem"}>Search</Typography>
        <Grid alignItems={"center"} container sx={{background:"#fff",border:"1px solid #768463",borderRadius:"5px"}}>
            <Grid item md={10.5}>
                <TextField value={searchValue} onChange={onChange} placeholder={"Search by Booking Code, Name, or Trip"} sx={{width:"522px"}}/>
            </Grid>
            <Grid item md={1.5} display={"flex"} alignItems={"center"} zIndex={10} sx={{cursor:"pointer"}} onClick={onSearchBtnClicked}>
                <Box  sx={{height:"45px",width:"2px",background:"#768463",mr:"1rem"}}/>
                <Image src={SearchIcon} height={20.4} width={20.4}/>
            </Grid>
        </Grid>
    </Box>)
}

export default SearchField;