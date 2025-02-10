import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useSession from "../hooks/useSession";
import { CircularProgress } from "@mui/material";
import { useRole } from "../context/RoleContext";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession();
  const location = useLocation();
  const { role } = useRole();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" />;
  } else if (
    !role &&
    location.pathname !== "/role" &&
    location.pathname !== "/login"
  ) {
    return <Navigate to="/role" />;
  }

  return children;
};

export default ProtectedRoute;
