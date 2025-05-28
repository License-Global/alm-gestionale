import { Card, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CampaignIcon from "@mui/icons-material/Campaign";

const icons = {
  cliente: <NotificationsIcon sx={{ color: "#fbc02d" }} />,
  commessa: <AssignmentIcon sx={{ color: "#424242" }} />,
  messaggio: <CampaignIcon sx={{ color: "#0288d1" }} />,
};

const NotificationCard = ({
  type = "cliente",
  title,
  id,
  name,
  category,
  date,
  time,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
        px: 2,
        py: 1,
        borderRadius: 3,
        backgroundColor: type === "cliente" ? "#f9fbe7" : "#ffffff",
      }}
    >
      <Box sx={{ mr: 2 }}>{icons[type]}</Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", fontFamily: "monospace" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          ID: {id} – {name} ({category})
        </Typography>
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {date}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {time}
        </Typography>
      </Box>
    </Card>
  );
};

export default NotificationCard;
