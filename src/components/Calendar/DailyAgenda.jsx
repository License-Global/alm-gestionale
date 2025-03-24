import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useAllOrders } from "../../hooks/useOrders";
import { styled } from "@mui/system";
import moment from "moment";
import "../../styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchCustomers } from "../../services/customerService";

const localizer = momentLocalizer(moment);

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
  showMore: (total) => `+ Mostra altri ${total}`,
  noEventsInRange: "Nessun ordine in questo intervallo",
};

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
    display: none;
  }
`;

const DailyAgenda = ({ date }) => {
  const { orders } = useAllOrders();
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const extractedEvents = [];

      orders.forEach((order) => {
        if (order.activities && Array.isArray(order.activities)) {
          order.activities
            .filter((activity) => activity.inCalendar)
            .forEach((activity) => {
              extractedEvents.push({
                title: `${
                  customers.find((c) => c.id === order.clientId)
                    ?.customer_name +
                  " - " +
                  order.orderName
                } - 
                ${activity.name}`,
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

  const formattedDate = new Date(
    `${date.slice(4, 8)}-${date.slice(2, 4)}-${date.slice(0, 2)}`
  );
  const eventPropGetter = (event) => {
    const backgroundColor = event.color || "#3174ad";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        padding: "2px",
      },
    };
  };
  return (
    <StyledCalendar
      localizer={localizer}
      events={events}
      defaultDate={formattedDate}
      startAccessor="start"
      endAccessor="end"
      views={["agenda"]}
      defaultView="agenda"
      length={0.1}
      toolbar={false}
      eventPropGetter={eventPropGetter}
      messages={messages}
    />
  );
};

export default DailyAgenda;
