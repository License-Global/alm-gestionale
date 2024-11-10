import React, { useState, useEffect } from "react";
import { Chip } from "@mui/material";

const Timer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        g: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) =>
    timeLeft[interval] ? (
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    ) : null
  );

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <Chip label="Scaduto" color="info" />
      )}
    </div>
  );
};

export default Timer;
