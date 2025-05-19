import React, { useState, useEffect } from "react";
import { Select, FormControl, MenuItem, Switch, Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { statusList } from "../../utils/enums/miscEnums";
import CalendarTool from "../Calendar/CalendarTool";
import { supabase } from "../../supabase/supabaseClient";
import { ToastContainer, toast, Slide } from "react-toastify";
import { TwitterPicker } from "react-color";
import dayjs from "dayjs";
import "dayjs/locale/it";

const OrderEditRow = ({ activity, personale, activityId }) => {
  const [activityName, setActivityName] = useState("");
  const [activityResponsible, setActivityResponsible] = useState("");
  const [activityStatus, setActivityStatus] = useState("");
  const [activityStartDate, setActivityStartDate] = useState(dayjs());
  const [activityEndDate, setActivityEndDate] = useState(dayjs());
  const [inCalendar, setInCalendar] = useState(false);
  const [activityColor, setActivityColor] = useState("#fff");
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
    setActivityColor(activity.color);
  }, [activity]);

  // Funzione per controllare la disponibilità del responsabile,
  // escludendo l'attività corrente dal controllo
  const checkAvailability = async (
    responsible,
    start,
    end,
    currentActivityId
  ) => {
    const { data, error } = await supabase
      .from("activities")
      .select("id, startDate, endDate")
      .eq("responsible", responsible);
    if (error) {
      console.error("Errore nel controllo della disponibilità:", error);
      return false;
    }
    const conflict = data.some((act) => {
      if (act.id === currentActivityId) return false;
      const existingStart = new Date(act.startDate);
      const existingEnd = new Date(act.endDate);
      return start < existingEnd && end > existingStart;
    });
    return !conflict;
  };

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
        color,
        completed,
      } = updatedActivity;
      const { data, error } = await supabase
        .from("activities")
        .update({
          name,
          status,
          endDate,
          startDate,
          responsible,
          inCalendar,
          color,
          completed,
        })
        .eq("id", id);
      if (error) throw error;

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
    } else {
      setCompleted(null);
    }
  };

  useEffect(() => {
    handleCompleted();
  }, [activityStatus]);

  const handleSave = async () => {
    const start = activityStartDate.toDate
      ? activityStartDate.toDate()
      : new Date(activityStartDate);
    const end = activityEndDate.toDate
      ? activityEndDate.toDate()
      : new Date(activityEndDate);
    const available = await checkAvailability(
      activityResponsible,
      start,
      end,
      activityId
    );
    if (!available) {
      notifyError("Responsabile già occupato in questo orario");
      return;
    }
    const updatedActivity = {
      ...activity,
      name: activityName,
      status: activityStatus,
      endDate: activityEndDate,
      startDate: activityStartDate,
      responsible: activityResponsible,
      inCalendar: inCalendar,
      color: activityColor,
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
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
            <CalendarTool
              operatorId={activityResponsible || activity.responsible}
            />
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
            onChange={(date) => setActivityStartDate(dayjs(date))}
            skipDisabled
            disablePast
          />
        </TableCell>
        <TableCell>
          <DateTimePicker
            defaultValue={dayjs(activity.endDate)}
            value={activityEndDate || activity.endDate}
            onChange={(date) => setActivityEndDate(dayjs(date))}
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
          {inCalendar ? (
            <TwitterPicker
              styles={{
                default: {
                  card: {
                    boxShadow: `0 0 10px ${activityColor}`,
                  },
                },
              }}
              color={activityColor}
              onChangeComplete={(color) => setActivityColor(color.hex)}
            />
          ) : (
            <div style={{ visibility: "hidden" }}>
              <TwitterPicker
                styles={{
                  default: {
                    card: {
                      boxShadow: `0 0 10px ${activityColor}`,
                    },
                  },
                }}
                color={activityColor}
                onChangeComplete={(color) => setActivityColor(color.hex)}
              />
            </div>
          )}
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
