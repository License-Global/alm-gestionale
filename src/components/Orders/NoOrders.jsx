import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function NoOrders() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography variant="h4" color="textSecondary" gutterBottom>
        Nessun ordine disponibile
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Al momento non ci sono ordini da mostrare
      </Typography>
    </Box>
  );
}

export default NoOrders;
