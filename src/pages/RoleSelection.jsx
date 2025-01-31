import React, {useState, useEffect} from 'react'
import {
    AppBar,
    Box,
    Button,
    Container,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import theme from '../theme';

const RoleSelection = () => {
    const GradientBackground = styled(Box)({
        background: "linear-gradient(45deg, #4fc3f7 30%, #81c784 90%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    });

    const FormContainer = styled(Container)({
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
    });

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSubmit = async (e) => {
      e.preventDefault();
    };

    return (
        <GradientBackground>
            <FormContainer maxWidth="xs">
                <Typography sx={{marginBottom: "20px"}} component="h1" variant="h5" align="center" gutterBottom>
                    Seleziona il ruolo
                </Typography>
                <Box onSubmit={handleSubmit} sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 1 }}>
                    <Button variant='contained'>Admin</Button>
                    <Button variant="contained">Operatore</Button>
                </Box>
            </FormContainer>
        </GradientBackground>
    )
}

export default RoleSelection
