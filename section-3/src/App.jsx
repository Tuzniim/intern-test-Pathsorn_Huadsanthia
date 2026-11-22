
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* หน้า Login */}
          <Route path="/" element={<Login />} />

          {/* หน้า Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* หน้า Employee */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <Employee />
              </ProtectedRoute>
            }
          />

          {/* URL ที่ไม่มีในระบบ */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
