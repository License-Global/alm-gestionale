import { supabase } from "../../supabase/supabaseClient";

export const activitiesById = async (operatorId) => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("responsible", operatorId)
    .order("id"); // Ordina le attività per id crescente

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const isOperatorAvailable = (
  activities,
  rangeStartDate,
  rangeEndDate
) => {
  // Convertiamo le date della query in oggetti Date
  const queryStart = new Date(rangeStartDate);
  const queryEnd = new Date(rangeEndDate);

  // Per ogni attività, controlliamo se il suo range si sovrappone a quello passato
  for (const activity of activities) {
    const activityStart = new Date(activity.startDate);
    const activityEnd = new Date(activity.endDate);

    // La condizione per la sovrapposizione:
    // l'attività inizia prima che il range termini e il range inizia prima che l'attività termini
    if (activityStart <= queryEnd && queryStart <= activityEnd) {
      return false; // Operatore occupato
    }
  }

  return true; // Nessuna sovrapposizione, operatore disponibile
};
