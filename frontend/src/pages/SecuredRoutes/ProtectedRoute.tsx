import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const ProtectedRoute = () => {
  const location = useLocation();
  const { checkAuthStatus, loading, navigationState } = useCheckAuth();
  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, [location.pathname]);

  if (loading || !navigationState) return <Loader />;

  if (
    navigationState?.shouldRedirect &&
    navigationState.redirectPath !== window.location.pathname
  ) {
    return <Navigate to={navigationState.redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
