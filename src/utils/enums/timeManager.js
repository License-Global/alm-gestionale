import Timer from "../../components/misc/Timer";
import { Chip } from "@mui/material";
import {
  differenceInMinutes,
  differenceInDays,
  differenceInHours,
} from "date-fns";

function getDifferenceInDaysHoursAndMinutesString(date1, date2) {
  // Calcola la differenza totale in minuti
  const totalMinutesDifference = Math.abs(differenceInMinutes(date2, date1));

  // Calcola la differenza in giorni interi
  const daysDifference = Math.abs(differenceInDays(date2, date1));

  // Calcola la differenza in ore intere rimanenti dopo aver sottratto i giorni
  const remainingHours =
    Math.abs(differenceInHours(date2, date1)) - daysDifference * 24;

  // Calcola i minuti rimanenti dopo aver sottratto i giorni e le ore
  const remainingMinutes =
    totalMinutesDifference - daysDifference * 24 * 60 - remainingHours * 60;

  // Costruisci la stringa del risultato
  let result = "";
  if (daysDifference > 0) {
    result += `${daysDifference}G `;
  }
  if (remainingHours > 0) {
    result += `${remainingHours}H `;
  }
  result += `${remainingMinutes}min `;

  return result.trim();
}

export const handleTargetLabel = (expire, completed) => {
  if (completed) {
    if (Math.abs(differenceInMinutes(expire, completed)) < 5) {
      return <Chip color="info" label={`In orario`} />;
    } else if (expire > completed) {
      return (
        <Chip
          color="success"
          label={`Anticipo di
            ${getDifferenceInDaysHoursAndMinutesString(expire, completed)}`}
        />
      );
    } else if (expire < completed) {
      return (
        <Chip
          color="error"
          label={`Ritardo di
            ${getDifferenceInDaysHoursAndMinutesString(expire, completed)}`}
        />
      );
    }
    // else if (expire < completed) {
    //     return (<button className=' w-full cursor-default btn rounded-xl btn-error'>Ritardo di {Math.abs(differenceInMinutes(expire, completed)) >= 60 ? Math.abs(differenceInHours(expire, completed)) + " H" : Math.abs(differenceInMinutes(expire, completed)) + " m"}</button>)
    // }
  } else {
    return <Timer targetDate={expire} />;
  }
};

// Funzione per calcolare la durata media delle attività
export function calcolaDurataMedia(attivita) {
  if (!Array.isArray(attivita) || attivita.length === 0) {
    return 0;
  }

  const durate = attivita.map((a) => {
    const start = new Date(a.startDate);
    const end = new Date(a.completed);
    return (end - start) / (1000 * 60 * 60); // Durata in ore
  });

  const durataTotale = durate.reduce((tot, durata) => tot + durata, 0);
  return durataTotale / attivita.length; // Media
}

// Funzione per verificare overlapping delle attività
export function trovaOverlapping(attivita) {
  if (!Array.isArray(attivita) || attivita.length === 0) {
    return [];
  }

  // Ordina le attività per data di inizio
  const attivitaOrdinate = attivita
    .slice()
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const overlapping = [];

  for (let i = 0; i < attivitaOrdinate.length; i++) {
    for (let j = i + 1; j < attivitaOrdinate.length; j++) {
      const start1 = new Date(attivitaOrdinate[i].startDate);
      const end1 = new Date(attivitaOrdinate[i].completed);
      const start2 = new Date(attivitaOrdinate[j].startDate);
      const end2 = new Date(attivitaOrdinate[j].completed);

      // Verifica se c'è sovrapposizione
      if (start2 < end1 && start1 < end2) {
        overlapping.push({
          attivita1: attivitaOrdinate[i].name,
          attivita2: attivitaOrdinate[j].name,
          periodo: {
            inizio: new Date(Math.max(start1, start2)),
            fine: new Date(Math.min(end1, end2)),
          },
        });
      }
    }
  }

  return overlapping;
}
