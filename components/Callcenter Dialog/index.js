import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Typography,Box } from '@mui/material';

export default function MenuDialog({open,handleClose,active,notifications}){

  return (
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{style:{width:648}}}
        sx={{mt:"3rem"}}
      >
        {notifications.map(({name,phoneNumber},ind)=>{
          return (
            <MenuItem>
              <Box sx={{width:"100%"}}>
                <Box sx={{display:"flex",alignItems:"center"}}>
                    <Box sx={{height:"12px",width:"12px",borderRadius:"12px",background:active&&ind===0?"#768463":"#fff",mr:"1rem",border:"1px solid #768463"}}/>
                    <Typography fontSize={"12px"} fontWeight={active&&ind===0?600:400}>Remind {name} to pay before the reservation cancels with this Phone No. {phoneNumber}</Typography>
                </Box>
                <Divider sx={{color:"#768463"}}/>
              </Box>
             </MenuItem>
          )
        })}
      </Menu>
  );
}