
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  mockGetMyTasks,
  mockCompleteTask
} from "../api/mockApi";

import { useAuth } from "../context/AuthContext";

export default function Employee() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // โหลดข้อความแจ้งเตือนเมื่อถูก Redirect กลับมา
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);

      // ล้างข้อความจาก Navigation State
      navigate(location.pathname, {
        replace: true,
        state: null
      });
    }
  }, [location, navigate]);

  // โหลดเฉพาะ Task ของตัวเอง
  const loadTasks = async () => {
    setLoading(true);

    try {
      const data = await mockGetMyTasks(user.id);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user.id]);

  // เปลี่ยนสถานะ Task เป็น Done
  const handleComplete = async (taskId) => {
    setCompletingId(taskId);
    setError("");

    try {
      const updatedTask = await mockCompleteTask(
        taskId,
        user.id
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Welcome, {user.displayName}</p>
        </div>

        <button onClick={logout}>Logout</button>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <section className="task-list">
        <h2>My Tasks</h2>

        {loading && <p>Loading tasks...</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>No tasks assigned to you.</p>
        )}

        {!loading && tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>

            <p>
              Status: <strong>{task.status}</strong>
            </p>

            {task.status === "To Do" && (
              <button
                onClick={() => handleComplete(task.id)}
                disabled={completingId === task.id}
              >
                {completingId === task.id
                  ? "Updating..."
                  : "Mark as Done"}
              </button>
            )}

            {task.status === "Done" && (
              <span className="done-label">
                Completed
              </span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
