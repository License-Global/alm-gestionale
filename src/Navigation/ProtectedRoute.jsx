import React from "react";
import { Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
