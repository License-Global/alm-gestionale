import React, { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { supabase } from "../../supabase/supabaseClient";

const OperatorDateTimePicker = ({
  operatoreId,
  onChange,
  value,
  excludeActivityId,
}) => {
  const [busyRanges, setBusyRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!operatoreId) {
      setBusyRanges([]);
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      setLoading(true);
      const { data: activities, error } = await supabase
        .from("activities")
        .select("id,startDate,endDate")
        .eq("responsible", operatoreId);

      if (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
        return;
      }

      // Filter out the current activity being edited
      const filteredActivities = excludeActivityId
        ? activities.filter((activity) => activity.id !== excludeActivityId)
        : activities;

      const ranges = filteredActivities.map(({ startDate, endDate }) => ({
        start: dayjs(startDate),
        end: dayjs(endDate),
      }));

      setBusyRanges(ranges);
      setLoading(false);
    };
    fetchActivities();
  }, [operatoreId, excludeActivityId]);
  const isDateDisabled = (date) => {
    // Disable dates in the past (before today)
    const today = dayjs().startOf("day");
    return date.isBefore(today);
  };
  const isTimeDisabled = (time, clockType) => {
    if (!time) return false;

    // Allow only times between 08:00 and 20:00 (8 AM to 8 PM)
    const hour = time.hour();
    if (hour < 8 || hour >= 20) {
      return true;
    }

    // Check if the specific time falls within any busy range
    return busyRanges.some(({ start, end }) => {
      // Add a small buffer (1 minute) around busy periods
      return (
        time.isAfter(start.subtract(1, "minute")) &&
        time.isBefore(end.add(1, "minute"))
      );
    });
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <DateTimePicker
          label={
            busyRanges.length > 0
              ? "Seleziona data e ora libere"
              : "Seleziona data e ora"
          }
          value={value}
          onChange={onChange}
          shouldDisableDate={isDateDisabled}
          shouldDisableTime={(time, clockType) => {
            if (!time) return false;
            return isTimeDisabled(time, clockType);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      )}
    </>
  );
};

export default OperatorDateTimePicker;
