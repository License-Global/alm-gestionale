import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AddOrder from "../pages/AddOrder";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
const AppRouter = () => (
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route path="/aggiungi" element={<AddOrder />} />
    <Route path="/login" element={<Login />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
