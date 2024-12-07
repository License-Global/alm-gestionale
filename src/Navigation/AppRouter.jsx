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
import ProtectedRoute from "./ProtectedRoute";
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
      path="/aggiungi"
      element={
        <ProtectedRoute>
          <AddOrder />
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
      path="/archivio"
      element={
        <ProtectedRoute>
          <Archivio />
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
          <CalendarComponent />
        </ProtectedRoute>
      }
    />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
