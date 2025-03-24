import * as Yup from "yup";

export const activityOrderSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9À-ÿ ]+$/, "Sono ammessi solo lettere e numeri")
    .max(15, "Non deve superare i 15 caratteri")
    .required("Campo obbligatorio"),
  responsible: Yup.string().required("Campo obbligatorio"),
  startDate: Yup.date().required("Campo obbligatorio"),
  endDate: Yup.date()
    .min(
      Yup.ref("startDate"),
      "La data di fine deve essere uguale o successiva a quella di inizio"
    )
    .required("Campo obbligatorio"),
});

export const operatorAddSchema = Yup.object({
  workerName: Yup.string()
    .matches(/^[a-zA-Z0-9À-ÿ ]+$/, "Sono ammessi solo lettere e numeri")
    .max(30, "Non deve superare i 30 caratteri")
    .required("Campo obbligatorio"),
});
export const customerAddSchema = Yup.object({
  customer_name: Yup.string()
    .matches(/^[a-zA-Z0-9À-ÿ ]+$/, "Sono ammessi solo lettere e numeri")
    .max(15, "Non deve superare i 15 caratteri")
    .required("Campo obbligatorio"),
});
