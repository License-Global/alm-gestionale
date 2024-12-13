import { styled } from "@mui/system";
import { Paper, Typography, Button } from "@mui/material";

export const PageContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#f4f6f8",
  minHeight: "100vh",
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
}));

export const ChartContainer = styled("div")(({ theme }) => ({
  height: 300,
  marginBottom: theme.spacing(3),
}));

export const TableContainer = styled("div")(({ theme }) => ({
  overflowX: "auto",
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  padding: theme.spacing(0.5),
}));
