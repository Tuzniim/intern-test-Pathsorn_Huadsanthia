
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await signIn(username);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Task Management System</h1>
      <h2>Login</h2>

      <label>Select Account</label>

      <select
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      >
        <option value="admin">Admin</option>
        <option value="employee1">Employee 1</option>
        <option value="employee2">Employee 2</option>
      </select>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {loading && <p>Please wait...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}

export default Login;
