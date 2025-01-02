import React from "react";

const CustomAgendaEvent = ({ event, isFirstEventOfDay }) => {
  return (
    <div
      style={{
        marginLeft: isFirstEventOfDay ? 0 : "20px",
        transition: "margin-left 0.2s ease-in-out",
      }}
    >
      <span>{event.title}</span>
    </div>
  );
};

export default CustomAgendaEvent;
