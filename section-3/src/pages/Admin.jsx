
import { useEffect, useState } from "react";
import { mockGetAllTasks, mockCreateTask } from "../api/mockApi";
import { users } from "../data/users";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const employees = users.filter(
    (u) => u.role === "employee"
  );

  // โหลด Task ทั้งหมด
  const loadTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await mockGetAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // สร้าง Task ใหม่
  const handleCreateTask = async (e) => {
    e.preventDefault();

    setCreating(true);
    setError("");

    try {
      const newTask = await mockCreateTask(
        title,
        assignedTo
      );

      setTasks((prev) => [...prev, newTask]);

      setTitle("");
      setAssignedTo("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // แสดงชื่อ Employee จาก ID
  const getEmployeeName = (id) => {
    const employee = users.find((u) => u.id === id);
    return employee ? employee.displayName : "Unknown";
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.displayName}</p>
        </div>

        <button onClick={logout}>Logout</button>
      </header>

      <section className="create-task">
        <h2>Create New Task</h2>

        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Enter task name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            <option value="">Select Employee</option>

            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.displayName}
              </option>
            ))}
          </select>

          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Task"}
          </button>
        </form>
      </section>

      <section className="task-list">
        <h2>All Tasks</h2>

        {loading && <p>Loading tasks...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>No tasks found</p>
        )}

        {!loading && tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>Assigned to: {getEmployeeName(task.assignedTo)}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
