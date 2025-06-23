import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CircularProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useStaffActivities } from "../../hooks/useStaffActivities";
import { useOrderIdByActivity, useOrders } from "../../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import "../../styles/calendar.css";
import { fetchCustomers } from "../../services/customerService";

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
  allDay: "Giornata",
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
  showMore: (total) => `+ ${total}`,
  noEventsInRange: "Nessun ordine in questo intervallo",
};

export default function OperatorAgenda({ operatorId }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [customers, setCustomers] = useState([]);

  const { activities, loading, error } = useStaffActivities(operatorId);
  const { orderId, loadingAct, errorAct } =
    useOrderIdByActivity(selectedOrderId);
  const { orders, loading: loadingOrders, error: errorOrders } = useOrders();
  const navigate = useNavigate();

  // Componente personalizzato per gli eventi nel calendario
  const CustomEvent = ({ event }) => (
    <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
      <strong>{event.title}</strong>
      {event.desc && <div>{event.desc}</div>}
    </div>
  );

  // Assicura che il nome dell'ordine venga sempre trovato
  const getOrderName = (id) => {
    if (!orders || orders.length === 0) return "Caricamento...";
    const order = orders.find((o) => o.id === id);
    return order
      ? `${
          customers.find((c) => c.id === order.clientId)?.customer_name || ""
        } - ${order.orderName}`
      : "Ordine non trovato";
  };

  // Naviga all'ordine quando viene selezionato un evento
  useEffect(() => {
    if (orderId) {
      navigate(`/${orderId}`);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  // Caricamento eventi nel calendario
  useEffect(() => {
    if (loading || loadingOrders) return; // Attendere che i dati siano caricati

    if (activities && Array.isArray(activities) && orders.length > 0) {
      const extractedEvents = activities.map((activity) => ({
        title: `${getOrderName(activity.order_id)} - ${activity.name} - ${
          activity.status
        }`,
        start: new Date(activity.startDate),
        end: new Date(activity.endDate),
        responsible: activity.responsible,
        status: activity.status,
        color: activity.color,
        notes: activity.note,
        id: activity.id,
        activityName: activity.name,
      }));

      // Evita aggiornamenti inutili dello stato
      setEvents((prevEvents) => {
        const isSame =
          JSON.stringify(prevEvents) === JSON.stringify(extractedEvents);
        return isSame ? prevEvents : extractedEvents;
      });
    }
  }, [activities, orders, loading, loadingOrders]);

  // Gestisce la selezione di un evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedOrderId(event.id);
  };

  // Stile personalizzato per gli eventi nel calendario
  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.color || "#3174ad",
      borderRadius: "5px",
      opacity: 0.9,
      color: "white",
      border: "0px",
      padding: "2px",
    },
  });

  // Se i dati sono ancora in caricamento, mostra un loader
  if (loading || loadingOrders) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se c'è un errore, mostra un messaggio
  if (error || errorOrders) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Errore nel caricamento delle attività o degli ordini.
        </Typography>
      </Box>
    );
  }

  return (
    <StyledCalendar
      localizer={localizer}
      events={events}
      views={["month", "week", "agenda"]}
      startAccessor="start"
      endAccessor="end"
      messages={messages}
      selectable
      onSelectEvent={handleSelectEvent}
      eventPropGetter={eventPropGetter}
      style={{ height: "110vh" }}
      components={{ event: CustomEvent }}
    />
  );
}
