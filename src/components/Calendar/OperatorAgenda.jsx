import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CircularProgress } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useStaffActivities } from "../../hooks/useStaffActivities";
import { useOrderIdByActivity } from "../../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import "../../styles/calendar.css";

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

export default function OperatorAgenda({operatorId}) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const { activities, loading, error } = useStaffActivities(operatorId);
    const { orderId, loadingAct, errorAct } = useOrderIdByActivity(selectedOrderId) 
    const navigate = useNavigate();

    useEffect(() => {
        if (orderId) {
            navigate(`/order/${orderId}`);
        }
    }, [orderId, navigate]);


    useEffect(() => {
        if (loading){
            <CircularProgress />
        }
        if (activities && Array.isArray(activities)) {
            const extractedEvents = [];
            activities.forEach((activity) => {
                extractedEvents.push({
                    title: `${activity.name} ${" "} - ${activity.status}`,
                    start: new Date(activity.startDate),
                    end: new Date(activity.endDate),
                    responsible: activity.responsible,
                    status: activity.status,
                    color: activity.color,
                    notes: activity.note,
                    id: activity.id,
                    activityName: activity.name,
                });
            });
            setEvents(extractedEvents);
        }
    }, [activities]);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedOrderId(event.id)
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
                padding: "2px",
            },
        };
    };

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
            />
    );
}
