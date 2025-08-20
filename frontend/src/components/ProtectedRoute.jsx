import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { authNverification } from "../services/authService"
import MainLayout from "../layouts/MainLayout";


const ProtectedRoute = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authNverification().then((data) => {
        setIsVerified(data?.authNverification || false);
        console.log(data)
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isVerified ? (<MainLayout><Outlet /></MainLayout>) : <Navigate to="/login" replace />;
};

export default ProtectedRoute;