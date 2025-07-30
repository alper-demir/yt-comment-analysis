import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { authNverification } from "../services/authService"

const token = localStorage.getItem("token");

const ProtectedRoute = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authNverification().then((data) => {
        setIsVerified(data?.authNverification || false);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isVerified ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;