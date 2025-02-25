import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { removeRole } from "../../utils/cookies";
import { useRole } from "../../context/RoleContext";
import { supabase } from "../../supabase/supabaseClient";
import { Typography } from "@mui/material";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { role, removeRole } = useRole();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExit = () => {
    removeRole();
    supabase.auth.signOut();
    handleClose();
    navigate("/login");
  };
  const handleSettings = () => {
    navigate("/impostazioni");
    handleClose();
  };
  // const handleProfile = () => {
  //   navigate("/");
  //   handleClose();
  // };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon fontSize="large" sx={{ color: "black" }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={handleProfile}>
          <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <AccountCircleIcon fontSize="large" color="primary" />
            <Typography fontSize={"1rem"} variant="h6">
              Profilo
            </Typography>
          </span>
        </MenuItem> */}
        <MenuItem onClick={handleSettings}>
          <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <SettingsIcon style={{ color: "grayText" }} fontSize="large" />
            <Typography fontSize={"1rem"} variant="h6">
              Impostazioni
            </Typography>
          </span>
        </MenuItem>
        <MenuItem onClick={handleExit}>
          <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ExitToAppIcon fontSize="large" color="error" />
            <Typography fontSize={"1rem"} variant="h6">
              Esci
            </Typography>
          </span>
        </MenuItem>
      </Menu>
    </div>
  );
}
{
  /* <Button
  onClick={() => navigate("/calendario")}
  color="inherit"
  startIcon={<CalendarMonth />}
>
  <b>Calendario</b>
</Button>;
{
  role === btoa("admin") && (
    <Button
      onClick={() => navigate("/impostazioni")}
      color="inherit"
      startIcon={<SettingsIcon />}
    >
      <b>Impostazioni</b>
    </Button>
  );
}
<Button onClick={() => handleExit()} color="inherit" startIcon={<ExitToApp />}>
  <b>Esci</b>
</Button>; */
}
