import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Notes as NotesIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { useOrders } from "../../hooks/useOrders";

moment.locale("it");
const localizer = momentLocalizer(moment);

const StyledCalendar = styled(Calendar)`
  .rbc-header {
    background-color: #1976d2;
    color: white;
    font-weight: bold;
  }
  .rbc-off-range-bg {
    background-color: #f5f5f5;
  }
  .rbc-toolbar-label {
    font-size: 24px; /* Ingrandisce le scritte del mese */
  }
`;

const messages = {
  allDay: "Tutto il giorno",
  previous: "Precedente",
  next: "Successivo",
  today: "Oggi",
  month: "Mese",
  week: "Settimana",
  day: "Giorno",
  agenda: "Agenda",
  date: "Data",
  time: "Ora",
  event: "Evento",
};

export default function CalendarComponent() {
  const { orders } = useOrders();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const extractedEvents = [];

      orders.forEach((order) => {
        if (order.activities && Array.isArray(order.activities)) {
          order.activities
            .filter((activity) => activity.inCalendar)
            .forEach((activity) => {
              extractedEvents.push({
                title: `${order.orderName} - ${activity.name}`,
                start: new Date(activity.startDate),
                end: new Date(activity.endDate),
                orderName: order.orderName,
                responsible: activity.responsible,
                status: activity.status,
                color: activity.color,
                notes: activity.note,
                activityName: activity.name,
                urgency: order.urgency,
              });
            });
        }
      });

      setEvents(extractedEvents);
    }
  }, [orders]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  // Event styling to apply the color from the event's color property
  const eventPropGetter = (event) => {
    const backgroundColor = event.color || "#3174ad"; // Default color if none provided
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px",
      },
    };
  };

  return (
    <div className="h-screen p-4 bg-gray-100">
      <StyledCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        selectable
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        style={{ height: "calc(100vh - 2rem)" }}
      />

      {/* Event Details Dialog */}
      <Dialog
        open={isEventDialogOpen}
        onClose={handleCloseEventDialog}
        aria-labelledby="event-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="event-dialog-title">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <EventIcon />
            </Grid>
            <Grid item>Dettagli dell'Evento</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Grid container spacing={2}>
              {/* Titolo e Urgenza */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  {selectedEvent.title}
                </Typography>
                {selectedEvent.urgency && (
                  <Chip
                    label={`Urgenza: ${selectedEvent.urgency}`}
                    color={
                      selectedEvent.urgency === "Alta"
                        ? "error"
                        : selectedEvent.urgency === "Media"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                )}
              </Grid>

              {/* Responsabile */}
              <Grid item xs={12} sm={6}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <PersonIcon color="action" />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      <strong>Responsabile:</strong> {selectedEvent.responsible}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Stato */}
              <Grid item xs={12} sm={6}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <AssignmentIcon color="action" />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      <strong>Stato:</strong> {selectedEvent.status}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Date e Orari */}
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <AccessTimeIcon color="action" />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      <strong>Inizio:</strong>{" "}
                      {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <AccessTimeIcon
                      color="action"
                      style={{ visibility: "hidden" }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      <strong>Fine:</strong>{" "}
                      {moment(selectedEvent.end).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Note */}
              {selectedEvent.notes && selectedEvent.notes.length > 0 && (
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <NotesIcon color="action" />
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">
                        <strong>Note:</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  <div style={{ marginLeft: 32 }}>
                    {selectedEvent.notes.map((note) => (
                      <Typography
                        key={note._id}
                        variant="body2"
                        style={{ marginBottom: 8 }}
                      >
                        [{moment(note.created_at).format("DD/MM/YYYY HH:mm")}]{" "}
                        <strong>{note.sender}:</strong> {note.content}
                      </Typography>
                    ))}
                  </div>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventDialog} color="primary">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}