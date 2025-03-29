import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import OperatorToolAgenda from "./OperatorToolAgenda";
import EventNoteIcon from "@mui/icons-material/EventNote";

const CalendarTool = ({ operatorId }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button color="secondary" variant="contained" onClick={handleOpen}>
        <EventNoteIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Agenda Operatore</DialogTitle>
        <DialogContent>
          <OperatorToolAgenda operatorId={operatorId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CalendarTool;
