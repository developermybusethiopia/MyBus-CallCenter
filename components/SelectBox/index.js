import { useState,useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Box} from '@mui/material'
import {translateWord} from '../../utils/languageTranslation';
import { useLocale } from "../../utils/LanguageContext";

export default function SelectComponent({label,value,changeValue,options,error,differentFrom}){
  const [img,setImage] = useState("")
  useEffect(()=>{
    const imgFound = options.find((plc)=>plc["name"]===value)
    if(imgFound&&imgFound['img']){
      setImage(imgFound['img'].src)
    }
  },[value])
  const {locale} = useLocale()
    return(<Box sx={{display:{md:"inline-block",xs:"block"},width:{md:"260px",xs:"79vw"},mr:{md:"2.5rem",xs:"0"},my:{xs:"0.5rem",md:"0"},borderColor:"white"}}>
            <Select
            id={`${label}_id`}
            name={label}
            value={translateWord(locale,value)}
            displayEmpty
            onChange={changeValue}
            error={error}
            renderValue={(value) => {
                return (<Box sx={{ display: "flex",gap:"1rem",alignItems:"center",border:"solid 1px white",pl:2,}}>
                    {value}
                </Box>
                );
            }}
            sx={{
                width: {md:"260px",xs:"100%"},
                height:"70px",
                color: "grey",
                background:"white",
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 1)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 1)',
                }
              }}
            >
            {//eslint-disable-next-line
            options.map((opt)=>{
            return <MenuItem key={opt} value={opt}>
                      {opt}
                </MenuItem>})}
            </Select>
        </Box>);
}