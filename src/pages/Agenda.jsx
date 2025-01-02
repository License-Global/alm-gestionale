import React from "react";
import { useParams } from "react-router-dom";
import DailyAgenda from "../components/Calendar/DailyAgenda";

import BackButton from "../components/misc/BackButton";

const Agenda = () => {
  const { date } = useParams();
  return (
    <div>
      <BackButton title="Indietro" direction="/calendario" />
      <DailyAgenda date={date} />
    </div>
  );
};

export default Agenda;
