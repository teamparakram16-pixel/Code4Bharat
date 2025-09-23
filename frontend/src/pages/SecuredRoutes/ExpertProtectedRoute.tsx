import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const ExpertProtectedRoute = () => {
  const location = useLocation();
  const { checkAuthStatus, loading, navigationState, authState } =
    useCheckAuth();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, [location.pathname]);

  if (loading) return <Loader />;

  if (
    navigationState?.shouldRedirect &&
    navigationState.redirectPath !== window.location.pathname
  ) {
    return <Navigate to={navigationState.redirectPath} replace />;
  }

  // Additional check for expert role
  if (!loading && authState?.userRole !== "expert") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ExpertProtectedRoute;
