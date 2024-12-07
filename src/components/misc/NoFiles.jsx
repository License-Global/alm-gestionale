import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function NoFiles() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign={"center"}
      height="100%"
    >
      <Typography variant="h4" color="textSecondary" gutterBottom>
        Nessun file disponibile
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Al momento non ci sono file da mostrare
      </Typography>
    </Box>
  );
}

export default NoFiles;
