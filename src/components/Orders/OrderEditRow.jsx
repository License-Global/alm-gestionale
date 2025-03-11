import React, { useState, useEffect } from "react";
import { Select, FormControl, MenuItem, Switch, Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { statusList } from "../../utils/enums/miscEnums";
import { supabase } from "../../supabase/supabaseClient";
import { ToastContainer, toast, Slide } from "react-toastify";

import dayjs from "dayjs";
import "dayjs/locale/it";
// Importa la localizzazione italiana
const OrderEditRow = ({ activity, personale, activityId }) => {
  const [activityName, setActivityName] = useState("");
  const [activityResponsible, setActivityResponsible] = useState("");
  const [activityStatus, setActivityStatus] = useState("");
  const [activityStartDate, setActivityStartDate] = useState(dayjs());
  const [activityEndDate, setActivityEndDate] = useState(dayjs());
  const [inCalendar, setInCalendar] = useState(false);
  const [completed, setCompleted] = useState(null);

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });

  useEffect(() => {
    setActivityName(activity.name);
    setActivityResponsible(activity.responsible);
    setActivityStatus(activity.status);
    setActivityStartDate(dayjs(activity.startDate));
    setActivityEndDate(dayjs(activity.endDate));
    setInCalendar(activity.inCalendar);
  }, [activity]);

  const updateActivity = async (activityId, updatedActivity) => {
    try {
      const {
        id,
        name,
        status,
        endDate,
        startDate,
        responsible,
        inCalendar,
        completed,
      } = updatedActivity;

      const { data, error } = await supabase
        .from("activities") // Nome della tabella
        .update({
          name,
          status,
          endDate,
          startDate,
          responsible,
          inCalendar,
          completed,
        })
        .eq("id", id); // Filtra per ID attività
      if (error) throw error; // Se c'è un errore, lo cattura il catch

      notifySuccess("Attività aggiornata con successo!");
      return { success: true, data };
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento dell'attività:",
        error.message
      );
      notifyError("Errore durante l'aggiornamento dell'attività");
    }
  };

  const handleCompleted = () => {
    if (activityStatus === "Completato") {
      setCompleted(dayjs().toISOString());
    } else if (activityStatus !== "Completato") {
      setCompleted(null);
    }
  };

  useEffect(() => {
    handleCompleted();
  }, [activityStatus]);

  const handleSave = () => {
    const updatedActivity = {
      ...activity,
      name: activityName,
      status: activityStatus,
      endDate: activityEndDate,
      startDate: activityStartDate,
      responsible: activityResponsible,
      inCalendar: inCalendar,
      completed: completed,
    };

    updateActivity(activityId, updatedActivity);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme={"colored"}
        transition={Slide}
      />
      <TableRow
        key={activity.name}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {activity.name}
        </TableCell>
        <TableCell>
          <FormControl>
            <Select
              name="orderManager"
              value={activityResponsible || activity.responsible}
              defaultValue={activity.responsible}
              onChange={(e) => setActivityResponsible(e.target.value)}
            >
              {personale.personale.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {person.workerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <FormControl>
            <Select
              name="status"
              variant="outlined"
              value={activityStatus || activity.status}
              onChange={(e) => setActivityStatus(e.target.value)}
            >
              {statusList.map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <DateTimePicker
            defaultValue={dayjs(activity.startDate)}
            value={activityStartDate || activity.startDate}
            onChange={(date) => {
              setActivityStartDate(dayjs(date));
            }}
            skipDisabled
            disablePast
          />
        </TableCell>
        <TableCell>
          <DateTimePicker
            defaultValue={dayjs(activity.endDate)}
            value={activityEndDate || activity.endDate}
            onChange={(date) => {
              setActivityEndDate(dayjs(date));
            }}
            skipDisabled
            disablePast
          />
        </TableCell>
        <TableCell>
          <Switch
            checked={inCalendar}
            onChange={(e) => setInCalendar(e.target.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </TableCell>
        <TableCell>
          <Button onClick={handleSave} variant="contained" color="secondary">
            Salva
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default OrderEditRow;
