
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

function AdminPage() {
  return <h1>Welcome Admin</h1>;
}

function EmployeePage() {
  return <h1>Welcome Employee</h1>;
}

function App() {
  return (
    <Routes>
      {/* หน้า Login */}
      <Route path="/login" element={<Login />} />

      {/* หน้า Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* หน้า Employee */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeePage />
          </ProtectedRoute>
        }
      />

      {/* หน้าเริ่มต้น */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* URL ที่ไม่มีอยู่ */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
