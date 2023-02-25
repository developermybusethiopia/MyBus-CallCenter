import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useLocale } from '../../utils/LanguageContext';
import { translateWord } from '../../utils/languageTranslation';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function SelectPickUpLocation({value,setValue,pickUploactions}) {
  const {locale} = useLocale()
  return (
    <Box sx={{ width: "325px" }}>
      <FormControl>
        <InputLabel id="demo-simple-select-label">{translateWord(locale,"Pickup Location")}</InputLabel>
        <Select
          value={value}
          onChange={setValue}
          label={translateWord(locale,"Pickup Location")}
          sx={{width:{md:"325px",xs:"300px"},my:{md:0,xs:"0.5rem"},background:"white",boxShadow: "0px 0px 10px 0px #00000026"}}
        >
         {pickUploactions.map((location)=><MenuItem key={location} value={location}>{translateWord(locale,location)}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}