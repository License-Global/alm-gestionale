import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Container,
  ThemeProvider,
  alpha,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../../theme";
import { supabase } from "../../supabase/supabaseClient";

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

export default function SchemaSettings() {
  const [schemi, setSchemi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchemas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("activitiesSchemes")
        .select("*");
      if (error) {
        console.error("Error fetching schemas:", error);
        setError(error.message);
      } else {
        setSchemi(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred while fetching schemas.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSchema = async (id) => {
    try {
      await supabase.from("activitiesSchemes").delete().eq("id", id);
      fetchSchemas(); // Aggiorna la lista dopo la cancellazione
    } catch (error) {
      console.error("Error deleting schema:", error);
    }
  };

  useEffect(() => {
    fetchSchemas();
    const channel = supabase
      .channel("public:activitiesSchemes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activitiesSchemes" },
        (payload) => {
          console.log("Change received!", payload);
          fetchSchemas();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(
            "Subscribed to real-time changes on 'activitiesSchemes' table."
          );
        }
      });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchSchemas]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography>Loading...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <AnimatePresence>
          <Grid container spacing={3}>
            {schemi.map((schema) => (
              <MotionGrid
                item
                xs={12}
                sm={6}
                md={4}
                key={schema.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MotionCard
                  whileHover={{
                    y: -5,
                    boxShadow:
                      theme.shadows[4] || "0px 4px 10px rgba(0,0,0,0.2)",
                  }}
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
                      sx={{ fontWeight: 500, color: "text.primary" }}
                    >
                      {schema.schemaName}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteSchema(schema.id)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          color: "error.main",
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                      aria-label="delete schema"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </CardContent>
                </MotionCard>
              </MotionGrid>
            ))}
          </Grid>
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}
