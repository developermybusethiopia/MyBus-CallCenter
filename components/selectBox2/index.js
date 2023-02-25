import { useState,useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Box} from '@mui/material'
import { useLocale } from "../../utils/LanguageContext";

export default function SelectComponent({label,value,changeValue,options,setError,error,differentFrom}){
  const [img,setImage] = useState("")
  const [inputVal,setInputVal] = useState("")
  useEffect(()=>{
    const imgFound = options.find((plc)=>plc["name"]===value)
    if(imgFound&&imgFound['img']){
      setImage(imgFound['img'].src)
    }
  },[value])
  const {locale} = useLocale()
    return(<Box sx={{display:{md:"inline-block",xs:"block"},width:{md:"260px",xs:"79vw"},mr:{md:"2.5rem",xs:"0"},my:{xs:"0.5rem",md:"0"},borderColor:"white"}}>
            <Autocomplete
            id={label}
            value={value}
            onChange={changeValue}
            inputValue={inputVal}
            getOptionLabel={(option)=>option}
            onInputChange={(event, newInputValue) => {
            setInputVal(newInputValue);
            }}
            options={options.map((plc)=>{
              if(plc["name"]!==differentFrom)
                  return plc[plc["name"]]
              }).filter(opt=>opt!==null&&opt!==undefined)}
            renderOption={(props, option) => {
              return (<Box component="li" key={option+label} {...props}>
                {option}
              </Box>)
            }}
            renderInput={(params) => <TextField {...params} error={error} sx={{
                width: {md:"260px",xs:"100%"},
                height:"70px",
                color: "grey",
                justifyContent:"center",
                alignItems:"center",
                background:"white",
                '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 1)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 1)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 1)',
              }}}/>}
            />
        {/* </FormControl> */}
        </Box>);
}