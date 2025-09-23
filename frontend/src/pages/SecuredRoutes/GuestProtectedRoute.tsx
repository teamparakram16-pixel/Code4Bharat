import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const GuestProtectedRoute = () => {
  const location = useLocation();
  const { checkAuthStatus, loading, authState } = useCheckAuth();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, [location.pathname]);

  if (loading) return <Loader />;

  // If user is logged in, redirect them to their appropriate dashboard
  if (authState?.loggedIn) {
    // If they're logged in, redirect based on role
    if (authState.userRole === "expert") {
      return <Navigate to="/" replace />;
    } else if (authState.userRole === "user") {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Allow access only to non-authenticated users
  return <Outlet />;
};

export default GuestProtectedRoute;
