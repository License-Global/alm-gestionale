import React from "react";
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
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Edit as EditDocumentIcon,
  Archive as ArchiveIcon,
  Timeline as TimelineIcon,
  Badge as BadgeIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useRole } from "../../context/RoleContext";
import Searchbar from "../Appbar/Searchbar";
import { CalendarMonth } from "@mui/icons-material";

const drawerWidth = 240;
const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Dashboard", icon: <TimelineIcon />, path: "/Dashboard" },
  {
    text: "Commesse",
    icon: <AssignmentIcon />,
    children: [
      {
        text: "Mostra",
        childIcon: <FormatListBulletedIcon />,
        path: "/",
      },
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
    text: "Profilo",
    icon: <PersonIcon />,
    children: [
      { text: "Impostazioni Profilo", path: "/profilo/impostazioni" },
      { text: "Sicurezza", path: "/profilo/sicurezza" },
    ],
  },
  {
    text: "Impostazioni",
    icon: <SettingsIcon />,
    children: [
      { text: "Preferenze", path: "/impostazioni/preferenze" },
      {
        text: "Operatori",
        childIcon: <BadgeIcon />,
        path: "/impostazioni/operatori",
      },
    ],
  },
  { text: "Logout", icon: <LogoutIcon />, path: "/login" },
];

export default function DashboardLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openSubmenu, setOpenSubmenu] = React.useState(null);

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

  // Drawer content
  const drawerContent = (
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
  );

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
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
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
        </Toolbar>
      </AppBar>

      {/* Drawer sovrapposto */}
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
