import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NewOrder from "../pages/NewOrder";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Impostazioni from "../pages/Impostazioni";
import CalendarComponent from "../components/Calendar/Calendar";
import Gestisci from "../pages/Gestisci";
import EditOrderPage from "../pages/EditOrderPage";
import Archivio from "../pages/Archivio";
import ProtectedRoute from "./ProtectedRoute";
import OrderSummary from "../components/Orders/OrderSummary";
import Calendar from "../pages/Calendar";
import DailyAgenda from "../components/Calendar/DailyAgenda";
import Agenda from "../pages/Agenda";
import RoleSelection from "../pages/RoleSelection";
const AppRouter = () => (
  <Routes>
    <Route
      exact
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    <Route
      exact
      path="/role"
      element={
        <ProtectedRoute>
          <RoleSelection />
        </ProtectedRoute>
      }
    />

    <Route
      path="/aggiungi"
      element={
        <ProtectedRoute>
          <NewOrder />
        </ProtectedRoute>
      }
    />
    <Route
      path="/gestisci"
      element={
        <ProtectedRoute>
          <Gestisci />
        </ProtectedRoute>
      }
    />
    <Route
      path="/gestisci/:id"
      element={
        <ProtectedRoute>
          <EditOrderPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/archivio"
      element={
        <ProtectedRoute>
          <Archivio />
        </ProtectedRoute>
      }
    />
    <Route
      path="/archivio/:id"
      element={
        <ProtectedRoute>
          <OrderSummary />
        </ProtectedRoute>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route
      path="/impostazioni"
      element={
        <ProtectedRoute>
          <Impostazioni />
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendario"
      element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendario/:date"
      element={
        <ProtectedRoute>
          <Agenda />
        </ProtectedRoute>
      }
    />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
