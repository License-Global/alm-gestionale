import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  CssBaseline,
  Box,
  useTheme,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Breadcrumbs,
  Link as MUILink,
  Divider,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  Edit as EditDocumentIcon,
  Archive as ArchiveIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Groups as GroupsIcon,
  LocalOffer as LocalOfferIcon,
  FindInPage as FindInPageIcon,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useRole } from "../../context/RoleContext";
import Searchbar from "../Appbar/Searchbar";
import { CalendarMonth } from "@mui/icons-material";
import useUser from "../../hooks/useUser";
import NotificationTool from "./NotificationTool";
import { getCookie, setCookie } from "../../utils/cookies";

const drawerWidth = 240;
const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Dashboard", icon: <TimelineIcon />, path: "/Dashboard" },
  {
    text: "Commesse",
    icon: <AssignmentIcon />,
    children: [
      { text: "Nuova", childIcon: <AddIcon />, path: "/aggiungi" },
      {
        text: "Gestisci",
        childIcon: <EditDocumentIcon />,
        path: "/gestisci",
      },
      { text: "Archiviate", childIcon: <ArchiveIcon />, path: "/archivio" },
    ],
  },
  {
    text: "Operatori",
    icon: <GroupIcon />,
    path: "/operatori",
  },
  {
    text: "Clienti",
    icon: <GroupsIcon />,
    path: "/Clienti",
  },
  {
    text: "Documenti",
    icon: <FindInPageIcon />,
    path: "/Documenti",
  },
  {
    text: "Ordini",
    icon: <LocalOfferIcon />,
    children: [
      { text: "Visualizza", childIcon: <AssignmentIcon />, path: "/ordini" },
      {
        text: "Invia",
        childIcon: <EditDocumentIcon />,
        path: "/ordini",
      },
      { text: "Ricevi", childIcon: <ArchiveIcon />, path: "/ordini" },
    ],
  },

  // {
  //   text: "Profilo",
  //   icon: <PersonIcon />,
  //   children: [
  //     { text: "Impostazioni Profilo", path: "/profilo/impostazioni" },
  //     { text: "Sicurezza", path: "/profilo/sicurezza" },
  //   ],
  // },
  // {
  //   text: "Impostazioni",
  //   icon: <SettingsIcon />,
  //   children: [
  //     { text: "Preferenze", path: "/impostazioni/preferenze" },
  //     {
  //       text: "Operatori",
  //       childIcon: <BadgeIcon />,
  //       path: "/impostazioni/operatori",
  //     },
  //   ],
  // },
  { text: "Logout", icon: <LogoutIcon />, path: "/login" },
];

export default function DashboardLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // Leggi la sezione aperta dai cookie all'avvio
  const [openSubmenu, setOpenSubmenu] = React.useState(
    () => getCookie("openSubmenu") || null
  );
  const { userId } = useUser();

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 600;
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  const { role, removeRole } = useRole();

  // Breadcrumb
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbItems = pathnames.map((value, index) => {
    const to = "/" + pathnames.slice(0, index + 1).join("/");
    return (
      <MUILink
        key={to}
        component={Link}
        to={to}
        underline="hover"
        color={index === pathnames.length - 1 ? "text.primary" : "inherit"}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </MUILink>
    );
  });

  // Blocca la visualizzazione del menu se il ruolo non è admin
  const decodedRole = role ? atob(role) : null;
  const canShowMenu = decodedRole === "admin";

  // Drawer content
  const drawerContent = canShowMenu ? (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ text, icon, path, children }) => {
          const isOpen = openSubmenu === text;
          const isActive =
            location.pathname === path ||
            (children &&
              children.some((child) =>
                location.pathname.startsWith(child.path)
              ));

          if (children) {
            return (
              <Box key={text}>
                <Tooltip title={text} placement="right">
                  <ListItemButton
                    startIcon={children.icon}
                    onClick={() => setOpenSubmenu(isOpen ? null : text)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                    }}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ChevronLeftIcon
                        sx={{ transform: "rotate(180deg)" }}
                        fontSize="small"
                      />
                    </motion.div>
                  </ListItemButton>
                </Tooltip>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      {children.map((child) => {
                        const isSubActive = location.pathname === child.path;
                        return (
                          <ListItemButton
                            key={child.text}
                            sx={{
                              pl: 6,
                              mx: 1,
                              my: 0.5,
                              borderRadius: 2,
                              backgroundColor: isSubActive
                                ? "action.selected"
                                : "transparent",
                            }}
                            onClick={() => {
                              navigate(child.path);
                              setOpenSubmenu(null);
                              closeDrawer();
                            }}
                          >
                            {child.childIcon && (
                              <ListItemIcon>{child.childIcon}</ListItemIcon>
                            )}
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            );
          }

          return (
            <Tooltip title={text} placement="right" key={text}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  backgroundColor: isActive ? "action.selected" : "transparent",
                }}
                onClick={() => {
                  navigate(path);
                  closeDrawer();
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  ) : null;

  useEffect(() => {
    // Quando cambia la sezione aperta, aggiorna il cookie
    setCookie("openSubmenu", openSubmenu || "", 30); // 30 giorni
  }, [openSubmenu]);

  if (location.pathname === "/login" || location.pathname === "/role") {
    return children;
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Topbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {canShowMenu && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {role === btoa("operator") ? (
              <Searchbar minisearch={true} type={"operator-orders"} />
            ) : (
              <Searchbar />
            )}
            <Button
              onClick={() => navigate("/calendario")}
              color="inherit"
              startIcon={<CalendarMonth />}
            >
              <b>Calendario</b>
            </Button>
          </Box>
          {canShowMenu && (
            <NotificationTool key={location.pathname} userId={userId} />
          )}
          {!canShowMenu && (
            <>
              <Button
                onClick={() => navigate("/documenti")}
                color="inherit"
                startIcon={<FindInPageIcon />}
              >
                <b>Documenti</b>
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  removeRole();
                  navigate("/login");
                }}
                startIcon={<LogoutIcon />}
                sx={{ ml: 2, fontWeight: 600 }}
              >
                Esci
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer sovrapposto */}
      {canShowMenu && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={closeDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxShadow: "4px 0 16px rgba(0,0,0,0.2)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {drawerOpen && !isMobile && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              zIndex: theme.zIndex.drawer - 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Contenuto principale */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
        }}
      >
        <Toolbar />

        {pathnames.length > 0 && (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <MUILink component={Link} to="/" underline="hover" color="inherit">
              Home
            </MUILink>
            {breadcrumbItems}
          </Breadcrumbs>
        )}
        {children}
      </Box>
    </Box>
  );
}
