
import { Navigate, Outlet } from "react-router-dom";

function RutaProtegida() {

  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;

}

export default RutaProtegida;
