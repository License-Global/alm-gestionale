import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme";
import logo from "../../assets/logo.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Home as HomeIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Archive as ArchiveIcon,
  ExitToApp,
  CalendarMonth,
} from "@mui/icons-material";
import { supabase } from "../../supabase/supabaseClient";
import useSession from "../../hooks/useSession";
import BackButton from "../misc/BackButton";

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(
    45deg,
    ${theme.palette.primary.main},
    ${theme.palette.secondary.main}
  );
`;

const StyledTab = styled(Tab)`
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const Appbar = () => {
  const [tabValue, setTabValue] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSession();

  const handleExit = () => {
    supabase.auth.signOut();
    navigate("/login");
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleSelectedTab = () => {
    if (location.pathname === "/") {
      setTabValue(0);
    } else if (location.pathname === "/aggiungi") {
      setTabValue(1);
    } else if (location.pathname === "/gestisci") {
      setTabValue(2);
    } else if (location.pathname === "/archivio") {
      setTabValue(3);
    }
  };

  useEffect(() => {
    handleSelectedTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (location.pathname === "/login") {
    return null;
  } else
    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <StyledAppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img
                  alt="Logo"
                  onClick={() => navigate("/")}
                  src={logo}
                  width={isSmallScreen ? 0 : 120}
                  style={{ paddingTop: "6px", cursor: "pointer" }} // Percorso del logo
                />
              </Typography>
              <Button
                onClick={() => navigate("/calendario")}
                color="inherit"
                startIcon={<CalendarMonth />}
              >
                <b>Calendario</b>
              </Button>
              {session?.user.email === "alminfissi.dev@gmail.com" && (
                <Button
                  onClick={() => navigate("/impostazioni")}
                  color="inherit"
                  startIcon={<SettingsIcon />}
                >
                  <b>Impostazioni</b>
                </Button>
              )}
              <Button
                onClick={() => handleExit()}
                color="inherit"
                startIcon={<ExitToApp />}
              >
                <b>Esci</b>
              </Button>
            </Toolbar>
          </StyledAppBar>
          {session?.user.email === "alminfissi.operator@gmail.com" &&
            location.pathname !== "/" && (
              <BackButton title={"Home"} direction={"/"} />
            )}

          {session?.user.email === "alminfissi.dev@gmail.com" && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{ bgcolor: "background.paper", mt: 3, mb: 3 }}
            >
              <StyledTab
                sx={{ borderRadius: "30px" }}
                icon={<HomeIcon />}
                label="Home"
                onClick={() => navigate("/")}
              />
              <StyledTab
                sx={{ borderRadius: "30px" }}
                icon={<AddIcon />}
                label="Aggiungi"
                onClick={() => navigate("/aggiungi")}
              />
              <StyledTab
                sx={{ borderRadius: "30px" }}
                icon={<SettingsIcon />}
                label="Gestisci"
                onClick={() => navigate("/gestisci")}
              />
              <StyledTab
                sx={{ borderRadius: "30px" }}
                icon={<ArchiveIcon />}
                label="Archiviate"
                onClick={() => navigate("/archivio")}
              />
            </Tabs>
          )}
        </Box>
      </>
    );
};

export default Appbar;
