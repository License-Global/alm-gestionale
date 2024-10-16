import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import theme from "../theme";
import logo from "../assets/logo.webp";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

// Create a gradient background
const GradientBackground = styled(Box)({
  background: "linear-gradient(45deg, #4fc3f7 30%, #81c784 90%)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

// Style the form container
const FormContainer = styled(Container)({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "2rem",
  marginTop: "2rem",
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
});

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Errore nel login:", error);
      handleClick();
    } else {
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <GradientBackground>
      <AppBar position="static" color="transparent" elevation={0}></AppBar>
      <FormContainer maxWidth="xs">
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
        >
          <img
            alt="Logo"
            src={logo}
            width={isSmallScreen ? 120 : 400}
            style={{ paddingTop: "6px" }} // Percorso del logo
          />
        </Typography>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Accedi
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Indirizzo Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Accedi
          </Button>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Credenziali errate!
          </Alert>
        </Snackbar>
      </FormContainer>
    </GradientBackground>
  );
}
