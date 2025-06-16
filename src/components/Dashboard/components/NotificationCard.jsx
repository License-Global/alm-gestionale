import { Card, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

// Mappa type -> icona
const icons = {
  cliente: <NotificationsIcon sx={{ color: "#fbc02d" }} />,
  commessa: <AssignmentIcon sx={{ color: "#424242" }} />,
  messaggio: <CampaignIcon sx={{ color: "#0288d1" }} />,
  change: <ChangeCircleIcon sx={{ color: "#1976d2" }} />,
  "activity-status": <CheckCircleIcon sx={{ color: "#43a047" }} />,
  message: <CampaignIcon sx={{ color: "#0288d1" }} />,
  chat: <CampaignIcon sx={{ color: "#0288d1" }} />,
  // fallback
  default: <NotificationsIcon sx={{ color: "#fbc02d" }} />,
};

const NotificationCard = ({
  type = "cliente",
  title,
  id,
  name,
  category,
  date,
  time,
  displayMode = "create",
  message,
  action_url,
  action_label,
  icon,
  action_object,
  reference_object,
}) => {
  // Render icona custom o fallback
  const renderIcon = () =>
    icon ? (
      <i
        className={`icon-${icon}`}
        style={{ fontSize: 22, color: "#1976d2" }}
      />
    ) : (
      icons[type] || icons["default"]
    );

  // Render link azione se presente
  const renderActionLink = () =>
    action_url && action_label ? (
      <a
        href={action_url}
        style={{
          color: "#1976d2",
          fontWeight: 600,
          fontSize: 12,
          textDecoration: "underline",
          borderRadius: 3,
          padding: "1px 6px",
          background: "#f1f5fb",
          transition: "background 0.2s",
          marginLeft: 0,
          display: "inline-block",
          marginTop: 4,
        }}
      >
        {action_label}
      </a>
    ) : null;

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
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ mr: 2 }}>{renderIcon()}</Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", fontFamily: "monospace" }}
        >
          {title} -{" "}
          <RouterLink to={`/clienti/${action_object?.clientId}`}>
            {action_object?.client?.customer_name}
          </RouterLink>
        </Typography>
        {displayMode === "create" ? (
          <>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              ID: {id} – {name} ({category})
            </Typography>
            {renderActionLink()}
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {message}
            </Typography>
            {renderActionLink()}
          </>
        )}
      </Box>

      <Box sx={{ textAlign: "right", minWidth: 80 }}>
        <Typography
          variant={displayMode === "create" ? "body2" : "caption"}
          sx={{
            fontFamily: "monospace",
            color: displayMode === "create" ? undefined : "gray",
          }}
        >
          {date}
        </Typography>
        <Typography
          variant={displayMode === "create" ? "body2" : "caption"}
          sx={{
            fontFamily: "monospace",
            color: displayMode === "create" ? undefined : "gray",
            display: "block",
          }}
        >
          {time}
        </Typography>
      </Box>
    </Card>
  );
};

export default NotificationCard;
