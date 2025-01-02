import React from "react";
import { Calendar as DefaultCalendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarComponent from "../components/Calendar/Calendar";
moment.locale("it");
const localizer = momentLocalizer(moment);

const Calendar = () => {
  return (
    <>
      <CalendarComponent />
    </>
    // <div>
    //   <DefaultCalendar
    //     localizer={localizer}
    //     events={[
    //       {
    //         title: "Meeting",
    //         start: new Date(2024, 10, 20, 10, 0), // November 20, 2023, 10:00 AM
    //         end: new Date(2024, 10, 20, 12, 0), // November 20, 2023, 12:00 PM
    //       },
    //       {
    //         title: "Meeting2",
    //         start: new Date(2024, 10, 20, 10, 0), // November 20, 2023, 10:00 AM
    //         end: new Date(2024, 10, 20, 13, 0), // November 20, 2023, 12:00 PM
    //       },
    //     ]}
    //     startAccessor="start"
    //     endAccessor="end"
    //   />
    // </div>
  );
};

export default Calendar;
