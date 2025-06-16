import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRole } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import useUser from "../hooks/useUser";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [selectedRole, setSelectedRole] = useState("");
  const [adminPassInput, setAdminPassInput] = useState("");
  const [adminPassError, setAdminPassError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { role, setRole } = useRole();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (role) {
      navigate("/");
    }
  }, []);

  const handleRoleSelection = async () => {
    if (selectedRole === "admin") {
      setLoading(true);
      setAdminPassError(false);
      try {
        const { data, error } = await supabase.rpc("check_admin_login", {
          p_user_id: userId,
          p_code: adminPassInput,
        });
        if (error) {
          setAdminPassError(true);
        } else if (data === true) {
          setRole(selectedRole);
          navigate("/");
        } else {
          setAdminPassError(true);
        }
      } catch (e) {
        setAdminPassError(true);
      } finally {
        setLoading(false);
      }
    } else if (selectedRole === "operator") {
      setRole(selectedRole);
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(45deg, #4fc3f7 30%, #81c784 90%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 4 },
            bgcolor: "#fff",
            boxShadow: "0 4px 24px 0 rgba(33,150,243,0.08)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            sx={{
              mb: 3,
              color: "#1976d2",
              letterSpacing: 1,
            }}
          >
            Scegli il tuo ruolo
          </Typography>
          <Grid
            container
            spacing={3}
            direction={isMobile ? "column" : "row"}
            justifyContent="center"
            alignItems="stretch"
            sx={{ mb: 2 }}
          >
            <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
              <Paper
                elevation={selectedRole === "admin" ? 6 : 1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border:
                    selectedRole === "admin"
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  bgcolor: selectedRole === "admin" ? "#e3f2fd" : "#fafbfc",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  minHeight: { xs: 180, sm: 220 },
                }}
                onClick={() => {
                  setSelectedRole("admin");
                  setAdminPassInput("");
                  setAdminPassError(false);
                }}
              >
                <Box sx={{ fontSize: 48, mb: 1 }}>🔑</Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#1976d2"
                  sx={{ mb: 1 }}
                >
                  Admin
                </Typography>
                <Box sx={{ flex: 1 }} />
                {selectedRole === "admin" && (
                  <TextField
                    label="Password Admin"
                    variant="outlined"
                    type="password"
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                    value={adminPassInput}
                    onChange={(e) => {
                      setAdminPassInput(e.target.value);
                      setAdminPassError(false);
                    }}
                    error={adminPassError}
                    helperText={adminPassError ? "Password errata" : ""}
                    autoFocus
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
              <Paper
                elevation={selectedRole === "operator" ? 6 : 1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border:
                    selectedRole === "operator"
                      ? "2px solid #388e3c"
                      : "1px solid #e0e0e0",
                  bgcolor: selectedRole === "operator" ? "#e8f5e9" : "#fafbfc",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: { xs: 180, sm: 220 },
                }}
                onClick={() => {
                  setSelectedRole("operator");
                  setAdminPassInput("");
                  setAdminPassError(false);
                }}
              >
                <Box sx={{ fontSize: 48, mb: 1 }}>👷</Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#388e3c"
                  sx={{ mb: 1 }}
                >
                  Operatore
                </Typography>
                <Box sx={{ flex: 1 }} />
              </Paper>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mt: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#616161",
                fontWeight: 500,
                textAlign: isMobile ? "center" : "left",
                flex: 1,
              }}
            >
              Ruolo selezionato:{" "}
              <b>
                {selectedRole === "admin"
                  ? "Admin"
                  : selectedRole === "operator"
                  ? "Operatore"
                  : "Nessuno"}
              </b>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                boxShadow: "0 2px 8px 0 #1976d222",
                minWidth: 140,
              }}
              disabled={
                !selectedRole ||
                (selectedRole === "admin" && adminPassInput.length === 0) ||
                loading
              }
              onClick={handleRoleSelection}
            >
              {loading ? "Verifica..." : "Conferma"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RoleSelection;
