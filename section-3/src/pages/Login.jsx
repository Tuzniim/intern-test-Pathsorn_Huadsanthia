
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");

  const { login, loading, error } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await login(username);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      // แสดง Error จาก AuthContext
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Task Management</h1>
        <p>เข้าสู่ระบบเพื่อจัดการงาน</p>

        {location.state?.message && (
          <p className="error-message">
            {location.state.message}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <label>เลือกบัญชีผู้ใช้</label>

          <select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          >
            <option value="">-- Select User --</option>
            <option value="admin">Admin</option>
            <option value="employee1">John</option>
            <option value="employee2">Sarah</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </form>

        {loading && (
          <p className="loading-message">
            กำลังตรวจสอบข้อมูลผู้ใช้...
          </p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
}
