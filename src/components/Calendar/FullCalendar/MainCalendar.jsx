import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import itLocale from "@fullcalendar/core/locales/it";
import { usePersonale } from "../../../hooks/usePersonale";
import OperatorDateTimePicker from "../../misc/OperatorDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { supabase } from "../../../supabase/supabaseClient";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useRole } from '../../../context/RoleContext';

import "./MainCalendar.css";

const MainCalendar = ({ orders, onActivityUpdate }) => {
  // Persist viewMode in localStorage
  const getInitialViewMode = () => {
    return localStorage.getItem("calendarViewMode") || "activities";
  };

  const [viewMode, setViewMode] = useState(getInitialViewMode());
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    startDate: "",
    endDate: "",
    dateOrder: "",
  });
  const { personale } = usePersonale();
  const { role } = useRole();
  const isOperator = role && atob(role) === 'operator';

  // Funzione di validazione delle date
  const validateDates = useCallback(() => {
    const errors = {
      startDate: "",
      endDate: "",
      dateOrder: "",
    };

    let isValid = true;

    // Verifica che entrambe le date siano valide
    if (!formData.startDate) {
      errors.startDate = "La data di inizio è obbligatoria";
      isValid = false;
    }

    if (!formData.endDate) {
      errors.endDate = "La data di fine è obbligatoria";
      isValid = false;
    }

    // Se entrambe le date sono presenti, verifica l'ordine
    if (formData.startDate && formData.endDate) {
      let startDate, endDate;

      if (selectedEvent?.type === "activity") {
        // Per le attività, le date sono oggetti dayjs
        startDate = dayjs(formData.startDate);
        endDate = dayjs(formData.endDate);
      } else {
        // Per gli ordini, le date sono stringhe datetime-local
        startDate = dayjs(formData.startDate);
        endDate = dayjs(formData.endDate);
      }

      if (endDate.isBefore(startDate)) {
        errors.dateOrder =
          "La data di fine non può essere precedente alla data di inizio";
        isValid = false;
      }
    }
    setValidationErrors(errors);
    return isValid;
  }, [formData.startDate, formData.endDate, selectedEvent?.type]);

  // Validazione automatica quando cambiano le date
  useEffect(() => {
    if (isModalOpen && formData.startDate && formData.endDate) {
      validateDates();
    }
  }, [formData.startDate, formData.endDate, isModalOpen, validateDates]);

  const getWorkerName = (id) =>
    personale.find((p) => p.id === id)?.workerName || "Sconosciuto";

  const transformOrdersToEvents = (orders) => {
    if (!orders || !Array.isArray(orders)) return [];

    const events = [];

    if (viewMode === "activities") {
      // Vista attività - mostra solo le attività con inCalendar: true
      orders.forEach((order) => {
        if (order.activities && Array.isArray(order.activities)) {
          order.activities.forEach((activity) => {
            if (activity.inCalendar) {
              // Determine status color if no custom color is set
              let eventColor = activity.color;
              if (!eventColor) {
                switch (activity.status) {
                  case "Completato":
                    eventColor = "#28a745";
                    break;
                  case "Bloccato":
                    eventColor = "#dc3545";
                    break;
                  case "Standby":
                    eventColor = "#ffc107";
                    break;
                  default:
                    eventColor = "#007bff";
                }
              }

              events.push({
                id: `activity-${activity.id}`,
                // Aggiungi nome cliente nel titolo
                title: `${activity.name} - ${
                  order.client?.customer_name || ""
                }`,
                start: activity.startDate,
                end: activity.endDate,
                backgroundColor: eventColor,
                borderColor: eventColor,
                textColor: "#ffffff",
                extendedProps: {
                  type: "activity",
                  orderId: order.id,
                  orderName: order.orderName,
                  activityId: activity.id,
                  activityName: activity.name,
                  status: activity.status,
                  // Qui: responsible deve essere solo l'id
                  responsible:
                    activity.responsible?.id || activity.responsible || null,
                  urgency: order.urgency,
                  internal_id: order.internal_id,
                  // Qui: clientId deve essere solo l'id
                  clientId: order.client?.id || order.clientId || null,
                  client: order.client, // opzionale, solo per visualizzazione nome cliente
                },
              });
            }
          });
        }
      });
    } else {
      // Vista ordini - mostra tutti gli ordini
      orders.forEach((order) => {
        let eventColor = "#6f42c1"; // Colore viola per gli ordini
        switch (order.urgency) {
          case "Urgente":
            eventColor = "#dc3545";
            break;
          case "Alta":
            eventColor = "#fd7e14";
            break;
          case "Media":
            eventColor = "#ffc107";
            break;
          case "Bassa":
            eventColor = "#28a745";
            break;
        }

        events.push({
          id: `order-${order.id}`,
          // Aggiungi nome cliente nel titolo
          title: `${order.orderName} - ${order.client?.customer_name || ""}`,
          start: order.startDate,
          end: order.endDate,
          backgroundColor: eventColor,
          borderColor: eventColor,
          textColor: "#ffffff",
          extendedProps: {
            type: "order",
            orderId: order.id,
            orderName: order.orderName,
            urgency: order.urgency,
            internal_id: order.internal_id,
            isConfirmed: order.isConfirmed,
            // Qui: orderManager deve essere solo l'id
            orderManager: order.orderManager?.id || order.orderManager || null,
            // Qui: clientId deve essere solo l'id
            clientId: order.client?.id || order.clientId || null,
            client: order.client, // opzionale, solo per visualizzazione nome cliente
          },
        });
      });
    }

    return events;
  };
  const handleEventClick = (clickInfo) => {
    const { extendedProps } = clickInfo.event;

    setSelectedEvent({
      ...extendedProps,
      currentStart: clickInfo.event.start,
      currentEnd: clickInfo.event.end,
      eventId: clickInfo.event.id,
    });

    // Use dayjs objects for OperatorDateTimePicker or format for regular inputs
    if (extendedProps.type === "activity") {
      setFormData({
        startDate: clickInfo.event.start ? dayjs(clickInfo.event.start) : null,
        endDate: clickInfo.event.end ? dayjs(clickInfo.event.end) : null,
      });
    } else {
      // Format dates for datetime-local input for orders (convert UTC to local)
      const formatDateForInput = (date) => {
        if (!date) return "";
        // Convert UTC date to local and format as YYYY-MM-DDTHH:mm
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, "0");
        return (
          d.getFullYear() +
          "-" +
          pad(d.getMonth() + 1) +
          "-" +
          pad(d.getDate()) +
          "T" +
          pad(d.getHours()) +
          ":" +
          pad(d.getMinutes())
        );
      };

      setFormData({
        startDate: formatDateForInput(clickInfo.event.start),
        endDate: formatDateForInput(clickInfo.event.end),
      });
    }

    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setFormData({ startDate: null, endDate: null });
    setValidationErrors({ startDate: "", endDate: "", dateOrder: "" });
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Pulisci errori quando l'utente modifica il campo
    if (validationErrors[name] || validationErrors.dateOrder) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
        dateOrder: "",
      }));
    }
  };
  const handleSaveChanges = async () => {
    // Esegui validazione prima di salvare
    if (!validateDates()) {
      return; // Non procedere se la validazione fallisce
    }

    setSaving(true);
    try {
      // Format dates based on the event type
      let startDateFormatted, endDateFormatted;

      if (selectedEvent.type === "activity") {
        // Convert local time to UTC ISO string for timestampz
        startDateFormatted = formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null;
        endDateFormatted = formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null;

        // Update activity in Supabase
        const { data, error } = await supabase
          .from("activities")
          .update({
            startDate: startDateFormatted,
            endDate: endDateFormatted,
          })
          .eq("id", selectedEvent.activityId);

        if (error) {
          console.error("Error updating activity:", error);
          alert(
            "Errore durante il salvataggio delle modifiche: " + error.message
          );
          return;
        }

        console.log("Activity updated successfully:", data);

        // Show success message
        // const displayStartDate = formData.startDate
        //   ? formData.startDate.format("DD/MM/YYYY HH:mm")
        //   : "Non impostata";

        // const displayEndDate = formData.endDate
        //   ? formData.endDate.format("DD/MM/YYYY HH:mm")
        //   : "Non impostata";
        // alert(`
        // Attività aggiornata con successo:
        // ${selectedEvent.activityName}
        //
        // Nuova data inizio: ${displayStartDate}
        // Nuova data fine: ${displayEndDate}
        // `);

        // Call the callback to refresh data if provided
        if (onActivityUpdate) {
          onActivityUpdate();
        }
      } else {
        // For orders - convert local time to UTC ISO string for timestampz
        const startDateFormatted = formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null;
        const endDateFormatted = formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null;

        const { data, error } = await supabase
          .from("orders")
          .update({
            startDate: startDateFormatted,
            endDate: endDateFormatted,
          })
          .eq("id", selectedEvent.orderId);

        if (error) {
          console.error("Error updating order:", error);
          alert(
            "Errore durante il salvataggio delle modifiche: " + error.message
          );
          return;
        }

        console.log("Order updated successfully:", data);

        // Call the callback to refresh data if provided
        if (onActivityUpdate) {
          onActivityUpdate();
        }
      }
      handleModalClose();
      window.location.reload(); // Refresh the page after saving
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Errore imprevisto durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleEventMouseEnter = (mouseEnterInfo) => {
    mouseEnterInfo.el.style.cursor = "pointer";
    mouseEnterInfo.el.title = `${mouseEnterInfo.event.extendedProps.orderName} - ${mouseEnterInfo.event.extendedProps.status}`;
  };

  // Filtra gli ordini/attività in base al dipendente selezionato
  const filteredOrders =
    employeeFilter === "all"
      ? orders
      : orders
          .map((order) => ({
            ...order,
            activities: Array.isArray(order.activities)
              ? order.activities.filter(
                  (act) =>
                    act.responsible && (act.responsible.id || act.responsible) === employeeFilter
                )
              : [],
          }))
          .filter((order) => order.activities && order.activities.length > 0);

  const events = transformOrdersToEvents(filteredOrders);

  // Aggiorna localStorage quando cambia la modalità
  useEffect(() => {
    localStorage.setItem("calendarViewMode", viewMode);
  }, [viewMode]);

  return (
    <div className="main-calendar-container">
      <div className="calendar-controls" style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <div className="view-selector" style={{ minWidth: 220 }}>
          <FormControl size="small" fullWidth variant="outlined">
            <InputLabel id="view-mode-label">Modalità visualizzazione</InputLabel>
            <Select
              labelId="view-mode-label"
              id="view-mode"
              value={viewMode}
              label="Modalità visualizzazione"
              onChange={(e) => setViewMode(e.target.value)}
            >
              <MenuItem value="activities">Attività</MenuItem>
              <MenuItem value="orders">Ordini</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="view-selector" style={{ minWidth: 220 }}>
          <FormControl size="small" fullWidth variant="outlined">
            <InputLabel id="employee-filter-label">Per dipendente</InputLabel>
            <Select
              labelId="employee-filter-label"
              id="employee-filter"
              value={employeeFilter}
              label="Per dipendente"
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <MenuItem value="all">Tutti</MenuItem>
              {personale &&
                personale.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.workerName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
        }}
        locale={itLocale}
        style={{ textTransform: "capitalize" }}
        events={events}
        eventDisplay="block"
        height="auto"
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        dayMaxEvents={false}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        aspectRatio={1.8}
        contentHeight="auto"
        stickyHeaderDates={true}
      />

      {/* Modal for editing event dates */}
      {isModalOpen && !isOperator && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifica Date</h3>
              <button className="modal-close" onClick={handleModalClose}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedEvent && (
                <>
                  <div className="event-info">
                    <h4>
                      {selectedEvent.type === "activity"
                        ? "Attività"
                        : "Ordine"}
                      :
                      {selectedEvent.type === "activity"
                        ? selectedEvent.activityName
                        : selectedEvent.orderName}
                    </h4>
                    <p>
                      <strong>ID:</strong> {selectedEvent.internal_id}
                    </p>
                    {/* Mostra il nome del cliente se disponibile */}
                    <p>
                      <strong>Cliente:</strong>{" "}
                      {selectedEvent.client?.customer_name || "N/A"}
                    </p>
                    {selectedEvent.type === "activity" && (
                      <>
                        <p>
                          <strong>Stato:</strong> {selectedEvent.status}
                        </p>
                        <p>
                          <strong>Responsabile:</strong>{" "}
                          {getWorkerName(selectedEvent.responsible)}
                        </p>
                        <p>
                          <strong>Ordine:</strong> {selectedEvent.orderName}
                        </p>
                      </>
                    )}
                    <p>
                      <strong>Urgenza:</strong> {selectedEvent.urgency}
                    </p>
                  </div>{" "}
                  {selectedEvent.type === "activity" ? (
                    // Use OperatorDateTimePicker for activities
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="it"
                    >
                      {" "}
                      <div className="form-group">
                        <label>Data e ora inizio:</label>
                        <OperatorDateTimePicker
                          operatoreId={selectedEvent.responsible}
                          value={formData.startDate}
                          excludeActivityId={selectedEvent.activityId}
                          onChange={(newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              startDate: newValue,
                            }));
                            // Pulisci errori quando l'utente modifica il campo
                            if (validationErrors.startDate) {
                              setValidationErrors((prev) => ({
                                ...prev,
                                startDate: "",
                                dateOrder: "",
                              }));
                            }
                          }}
                        />
                        {validationErrors.startDate && (
                          <div className="error-message">
                            {validationErrors.startDate}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Data e ora fine:</label>
                        <OperatorDateTimePicker
                          operatoreId={selectedEvent.responsible}
                          value={formData.endDate}
                          excludeActivityId={selectedEvent.activityId}
                          onChange={(newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              endDate: newValue,
                            }));
                            // Pulisci errori quando l'utente modifica il campo
                            if (
                              validationErrors.endDate ||
                              validationErrors.dateOrder
                            ) {
                              setValidationErrors((prev) => ({
                                ...prev,
                                endDate: "",
                                dateOrder: "",
                              }));
                            }
                          }}
                        />
                        {validationErrors.endDate && (
                          <div className="error-message">
                            {validationErrors.endDate}
                          </div>
                        )}
                      </div>
                      {validationErrors.dateOrder && (
                        <div className="error-message date-order-error">
                          {validationErrors.dateOrder}
                        </div>
                      )}
                    </LocalizationProvider>
                  ) : (
                    // Use regular datetime-local inputs for orders
                    <>
                      {" "}
                      <div className="form-group">
                        <label htmlFor="startDate">Data e ora inizio:</label>
                        <input
                          type="datetime-local"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate || ""}
                          onChange={handleFormChange}
                          className="form-control"
                        />
                        {validationErrors.startDate && (
                          <div className="error-message">
                            {validationErrors.startDate}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="endDate">Data e ora fine:</label>
                        <input
                          type="datetime-local"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate || ""}
                          onChange={handleFormChange}
                          className="form-control"
                        />
                        {validationErrors.endDate && (
                          <div className="error-message">
                            {validationErrors.endDate}
                          </div>
                        )}
                      </div>
                      {validationErrors.dateOrder && (
                        <div className="error-message date-order-error">
                          {validationErrors.dateOrder}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>{" "}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleModalClose}
                disabled={saving}
              >
                Annulla
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={
                  saving ||
                  !formData.startDate ||
                  !formData.endDate ||
                  validationErrors.startDate ||
                  validationErrors.endDate ||
                  validationErrors.dateOrder
                }
              >
                {saving ? "Salvando..." : "Salva Modifiche"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Se operatore, mostra solo i dettagli senza form di modifica */}
      {isModalOpen && isOperator && selectedEvent && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Dettaglio evento</h3>
              <button className="modal-close" onClick={handleModalClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="event-info">
                <h4>{selectedEvent.type === "activity" ? "Attività" : "Ordine"}: {selectedEvent.type === "activity" ? selectedEvent.activityName : selectedEvent.orderName}</h4>
                <p><strong>ID:</strong> {selectedEvent.internal_id}</p>
                <p><strong>Cliente:</strong> {selectedEvent.client?.customer_name || "N/A"}</p>
                {selectedEvent.type === "activity" && (
                  <>
                    <p><strong>Stato:</strong> {selectedEvent.status}</p>
                    <p><strong>Responsabile:</strong> {getWorkerName(selectedEvent.responsible)}</p>
                    <p><strong>Ordine:</strong> {selectedEvent.orderName}</p>
                  </>
                )}
                <p><strong>Urgenza:</strong> {selectedEvent.urgency}</p>
                <p><strong>Inizio:</strong> {selectedEvent.currentStart ? dayjs(selectedEvent.currentStart).format('DD/MM/YYYY HH:mm') : '-'}</p>
                <p><strong>Fine:</strong> {selectedEvent.currentEnd ? dayjs(selectedEvent.currentEnd).format('DD/MM/YYYY HH:mm') : '-'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleModalClose}>Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCalendar;
