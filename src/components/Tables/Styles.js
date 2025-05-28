import { styled } from "@mui/system";
import theme from "../../theme";

import {
  Box,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";

export const StyledTableContainer = styled(TableContainer)`
  margin-top: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 1200px) {
    overflow-x: auto;
  }

  @media (max-width: 768px) {
    margin-top: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    margin-top: 12px;
    margin-left: -8px;
    margin-right: -8px;
  }
`;

export const StyledTableHead = styled(TableHead)`
  background-color: ${theme.palette.primary.light};
`;

export const StyledTableCell = styled(TableCell)`
  padding: 12px;

  @media (max-width: 768px) {
    padding: 8px 4px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 6px 2px;
    font-size: 0.75rem;
  }
`;

export const OrderInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    borderRadius: "8px",
  },
}));

export const OrderInfoItem = styled(Box)(({ theme }) => ({
  border: "2px",
  marginBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",

  "& .MuiSvgIcon-root": {
    marginRight: 0,
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: "2rem",
  },

  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(1.5),
    "& .MuiSvgIcon-root": {
      fontSize: "1.75rem",
    },
  },

  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(1),
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
      marginBottom: theme.spacing(0.5),
    },
  },
}));

export const StyledModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90vw", sm: "80vw", md: 500 },
  maxWidth: "500px",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  padding: { xs: "16px", sm: "20px", md: "24px" },
  textAlign: "center",
  border: "2px solid #4CAF50",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#388E3C",
    boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.3)",
  },
};

export const titleStyle = {
  fontFamily: "Georgia, serif", // Font serif
  fontWeight: 600,
  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
  textAlign: "center",
  textTransform: "capitalize", // Solo la prima lettera maiuscola
  letterSpacing: "1px",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  paddingBottom: "8px",
  cursor: "default",
};

// Nuovi stili per l'header responsivo
export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  padding: "16px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",

  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    gap: "16px",
    textAlign: "center",
  },

  [theme.breakpoints.down("md")]: {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "8px",
    marginBottom: "8px",
    gap: "12px",
  },
}));

export const HeaderLeftSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: "8px",
  },
}));

export const HeaderRightSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "24px",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

export const ClientInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "4px",
    textAlign: "center",
  },
}));
