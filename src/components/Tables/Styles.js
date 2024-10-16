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
  @media (max-width: 600px) {
    overflow-x: auto; /* Scroll orizzontale per schermi piccoli */
  }
`;

export const StyledTableHead = styled(TableHead)`
  background-color: ${theme.palette.primary.light};
`;

export const StyledTableCell = styled(TableCell)`
  padding: 16px;
`;

export const OrderInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
}));

export const OrderInfoItem = styled(Box)(({ theme }) => ({
  border: "2px",
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export const StyledModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  padding: "24px",
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
  fontSize: "1.8rem",
  textAlign: "center",
  textTransform: "capitalize", // Solo la prima lettera maiuscola
  letterSpacing: "1px",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  paddingBottom: "8px",
  cursor: "default",
};
