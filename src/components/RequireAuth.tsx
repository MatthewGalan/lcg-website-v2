import React from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const idToken = Cookies.get("lcg-id-token");

  if (!idToken) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  return children;
}
