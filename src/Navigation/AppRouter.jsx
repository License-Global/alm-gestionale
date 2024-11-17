import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AddOrder from "../pages/AddOrder";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Impostazioni from "../pages/Impostazioni";
import CalendarComponent from "../components/Calendar/Calendar";
import Gestisci from "../pages/Gestisci";
import EditOrderPage from "../pages/EditOrderPage";
import Archivio from "../pages/Archivio";
const AppRouter = () => (
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route path="/aggiungi" element={<AddOrder />} />
    <Route path="/gestisci" element={<Gestisci />} />
    <Route path="/archivio" element={<Archivio />} />
    <Route path="/gestisci/:id" element={<EditOrderPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/impostazioni" element={<Impostazioni />} />
    <Route path="/calendario" element={<CalendarComponent />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
