import * as Yup from 'yup';

export const mainOrderSchema = Yup.object({
    orderName: Yup.string()
        .matches(/^[a-zA-Z0-9À-ÿ ]+$/, "Sono ammessi solo lettere e numeri")
        .max(30, "Non deve superare i 30 caratteri")
        .required("Campo obbligatorio"),
    startDate: Yup.date().required('Campo obbligatorio'),
    endDate: Yup.date().required('Campo obbligatorio'),
    materialShelf: Yup.string().required('Campo obbligatorio'),
    urgency: Yup.string().required('Campo obbligatorio'),
    accessories: Yup.string().required('Campo obbligatorio'),
    orderManager: Yup.string().required('Campo obbligatorio'),
});
export const activityOrderSchema = Yup.object({
    name: Yup.string()
        .matches(/^[a-zA-Z0-9À-ÿ ]+$/, "Sono ammessi solo lettere e numeri")
        .max(15, "Non deve superare i 15 caratteri")
        .required("Campo obbligatorio"),
    responsible: Yup.string().required('Campo obbligatorio'),
    startDate: Yup.date().required('Campo obbligatorio'),
    endDate: Yup.date().required('Campo obbligatorio'),

});