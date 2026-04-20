import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../ui/Spinner";

export default function ProtectedRoute() {
  const { isAuthenticated, initDone } = useAuth();

  if (!initDone) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
