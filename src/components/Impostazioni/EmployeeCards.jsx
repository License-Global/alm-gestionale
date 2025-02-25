import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Container,
  ThemeProvider,
  TextField,
  Button,
  alpha,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../../theme";
import {
  insertPersonale,
  deletePersonale,
} from "../../services/personaleService";
import { supabase } from "../../supabase/supabaseClient";

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

export default function EmployeeCards() {
  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");

  useEffect(() => {
    // Function to fetch employees
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("personale").select("*");
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data);
      }
    };

    // Fetch initial employees
    fetchEmployees();

    // Set up real-time subscription
    const channel = supabase
      .channel("public:personale")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "personale" },
        (payload) => {
          console.log("Change received!", payload);
          fetchEmployees();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to real-time changes on 'personale' table.");
        }
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    const { error } = await deletePersonale(id);
    if (error) {
      console.error("Error deleting employee:", error);
    }
    // Real-time subscription will handle state update
  };

  const handleAddEmployee = async (event) => {
    event.preventDefault();
    if (!newEmployeeName) return;

    const { error } = await insertPersonale({
      workerName: newEmployeeName,
    });

    if (error) {
      console.error("Error adding employee:", error);
    } else {
      setNewEmployeeName("");
      // Real-time subscription will handle state update
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <AnimatePresence>
          <Grid container spacing={3}>
            {employees.map((employee) => (
              <MotionGrid
                item
                xs={12}
                sm={6}
                md={4}
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MotionCard
                  whileHover={{ y: -5, boxShadow: theme.shadows[4] }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: theme.shadows[1],
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 2.5,
                      px: 3,
                      "&:last-child": { pb: 2.5 },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        cursor: "pointer",
                      }}
                    >
                      {employee.workerName}
                    </Typography>
                    <IconButton
                      onClick={() => handleDelete(employee.id)}
                      sx={{
                        color: "grey",
                        "&:hover": {
                          color: "error.main",
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                      aria-label="delete employee"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </CardContent>
                </MotionCard>
              </MotionGrid>
            ))}
          </Grid>
        </AnimatePresence>
        <Box
          component={motion.form}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleAddEmployee}
          sx={{ mt: 5, display: "flex", gap: 2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nome del nuovo dipendente"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<PersonAddOutlinedIcon />}
            sx={{
              px: 4,
              py: 2,
              boxShadow: 2,
              "&:hover": {
                bgcolor: "primary.main",
                boxShadow: 4,
              },
            }}
          >
            Aggiungi
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
