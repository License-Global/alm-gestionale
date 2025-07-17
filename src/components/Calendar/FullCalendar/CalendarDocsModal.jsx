import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { Close as CloseIcon, Folder as FolderIcon } from "@mui/icons-material";
import AdminDocsModal from "../../misc/AdminDocsModal";
import useSession from "../../../hooks/useSession";
import useActiveUser from "../../../hooks/useActiveUser";

const CalendarDocsModal = ({ open, onClose, selectedEvent, orderData }) => {
  const session = useSession();
  const user = useActiveUser();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
    maxWidth: "800px",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 3,
    borderBottom: 1,
    borderColor: "divider",
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  };

  const bodyStyle = {
    flex: 1,
    overflow: "auto",
    p: 3,
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    p: 2,
    borderTop: 1,
    borderColor: "divider",
    backgroundColor: "grey.50",
  };

  // Costruisce il nome della cartella per i documenti
  const getFolderName = () => {
    if (!orderData || !selectedEvent) return "";
    if (selectedEvent.type === "activity") {
      return `${orderData.orderName}${orderData.clientId}/${selectedEvent.activityName}`;
    } else {
      return `${orderData.orderName}${orderData.clientId}`;
    }
  };

  const getModalTitle = () => {
    if (!selectedEvent) return "Documenti";
    if (selectedEvent.type === "activity") {
      return `Documenti - ${selectedEvent.activityName}`;
    } else {
      return `Documenti - ${selectedEvent.orderName}`;
    }
  };

  if (!open || !selectedEvent || !session?.session?.user?.id) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="calendar-docs-modal-title"
      closeAfterTransition
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={headerStyle}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FolderIcon />
            <Typography
              id="calendar-docs-modal-title"
              variant="h6"
              component="h2"
              fontWeight="bold"
            >
              {getModalTitle()}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "inherit" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={bodyStyle}>
          {selectedEvent && (
            <>
              {/* Info evento */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Dettagli{" "}
                  {selectedEvent.type === "activity" ? "Attività" : "Ordine"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nome:</strong>{" "}
                  {selectedEvent.type === "activity"
                    ? selectedEvent.activityName
                    : selectedEvent.orderName}
                </Typography>
                {selectedEvent.internal_id && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>ID:</strong> {selectedEvent.internal_id}
                  </Typography>
                )}
                {selectedEvent.client?.customer_name && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Cliente:</strong>{" "}
                    {selectedEvent.client.customer_name}
                  </Typography>
                )}
                {selectedEvent.type === "activity" && selectedEvent.status && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Stato:</strong> {selectedEvent.status}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* AdminDocsModal: upload solo per admin, lista per tutti */}
              <AdminDocsModal
                bucketName={session.session.user.id}
                folderName={getFolderName()}
              />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box sx={footerStyle}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            size="medium"
          >
            Chiudi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CalendarDocsModal;
