import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRole } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";

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

const RoleSelection = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");

  // const getPasskey = async () => {
  //   let { data: account, error } = await supabase
  //     .from("account")
  //     .select("admin_key");
  //   setAdminPass(account[0].admin_key);
  // };

  // useEffect(() => {
  //   getPasskey();
  // }, []);

  const { role, setRole } = useRole();

  const handleAdmin = () => {
    setSelectedRole("admin");
  };

  const handleOperator = () => {
    setSelectedRole("operator");
  };
  //   const handleRoleSelection = async () => {
  //     if (selectedRole === "admin") {
  //         const match = await bcrypt.compare(selectedPass, adminPass); // Verifica la password

  //         if (match) {
  //             setRole(selectedRole);
  //             navigate("/");
  //         } else {
  //             alert("Password errata");
  //         }
  //     } else if (selectedRole === "operator") {
  //         setRole(selectedRole);
  //         navigate("/");
  //     }
  // };

  const handleRoleSelection = () => {
    if (selectedRole === "admin") {
      setRole(selectedRole);
      navigate("/");
    } else if (selectedRole === "operator") {
      setRole(selectedRole);
      navigate("/");
    }
  }

  useEffect(() => {
    if (role) {
      navigate("/");
    }
  }, [])


  return (
    <GradientBackground>
      <FormContainer maxWidth="xs">
        <Typography
          sx={{ marginBottom: "20px" }}
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
        >
          Seleziona il ruolo
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 1 }}>
          <Box>
            <Button
              onClick={() => handleAdmin()}
              color="secondary"
              variant="contained"
            >
              Admin
            </Button>
            {/* <TextField
              sx={{
                mt: 1,
                visibility: `${showAdminPass ? "visible" : "hidden"}`,
              }}
              value={selectedPass}
              onChange={(e) => setSelectedPass(e.target.value)}
              label={"Admin pass"}
              variant="standard"
              type="password"
            /> */}
          </Box>
          <Box>
            <Button
              onClick={() => handleOperator()}
              color="secondary"
              variant="contained"
            >
              Operatore
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            Ruolo selezionato: <b>{selectedRole ? selectedRole : "Nessuno"}</b>
          </Typography>
          <Button
            onClick={() => handleRoleSelection()}
            disabled={!selectedRole}
            color="primary"
            variant="contained"
          >
            Conferma
          </Button>
        </Box>
      </FormContainer>
    </GradientBackground>
  );
};

export default RoleSelection;
