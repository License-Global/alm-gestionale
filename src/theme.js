import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#81D4FA", // Azzurro chiaro
    },
    secondary: {
      main: "#A5D6A7", // Verde chiaro
    },
    background: {
      default: "#f5f5f5", // Bianco
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "rgba(129, 212, 250, 0.1)", // Leggero azzurro al passaggio del mouse
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
        },
        head: {
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "0.75rem",
          color: "#546e7a",
        },
      },
    },
  },
});

export default theme;
