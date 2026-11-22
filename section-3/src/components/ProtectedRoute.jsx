
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // กรณียังไม่ได้ Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // กรณี Role ไม่ตรงกับหน้าที่ต้องการเข้า
  if (user.role !== allowedRole) {
    const redirectPath =
      user.role === "admin" ? "/admin" : "/employee";

    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ message: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้" }}
      />
    );
  }

  return children;
}
