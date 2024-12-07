import React from "react";
import { Button, styled } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  marginTop: "12px",
  marginBottom: "12px",
  marginLeft: "12px",
  padding: "10px 20px",
  borderRadius: "30px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
    transform: "translateY(-2px)",
  },
}));

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <StyledButton startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
      Home
    </StyledButton>
  );
};

export default BackButton;
