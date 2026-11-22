
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // กรณียังไม่ได้ Login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // กรณี Role ไม่ตรงกับหน้าที่เข้าถึง
  if (user.role !== allowedRole) {
    const correctPath =
      user.role === "admin" ? "/admin" : "/employee";

    return (
      <Navigate
        to={correctPath}
        replace
        state={{
          message: `คุณไม่มีสิทธิ์เข้าถึงหน้านี้ ระบบจึงนำคุณไปยังหน้า ${user.role}`
        }}
      />
    );
  }

  // Role ถูกต้อง อนุญาตให้เข้าหน้าได้
  return children;
}
