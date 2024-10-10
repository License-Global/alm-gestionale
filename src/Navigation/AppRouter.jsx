import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainTable from "../components/Tables/MainTable";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/asd" element={<MainTable />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
