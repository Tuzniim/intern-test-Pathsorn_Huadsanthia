
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function EmployeeTasks() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingIds, setPendingIds] = useState([]);
  const mutationVersion = useRef(0);

  const load = useCallback(
    async (showSpinner, isActive) => {
      const startVersion = mutationVersion.current;

      if (showSpinner) setLoading(true);

      try {
        const data = await api.getTasks(token);

        if (isActive() && startVersion === mutationVersion.current) {
          setTasks(data.tasks);
          setError('');
        }
      } catch (e) {
        if (isActive() && startVersion === mutationVersion.current) {
          setError('โหลดข้อมูลไม่สำเร็จ');
        }
      } finally {
        if (showSpinner && isActive()) {
          setLoading(false);
        }
      }
    },
    [token]
  );

  useEffect(() => {
    let active = true;
    const isActive = () => active;

    load(true, isActive);

    const timer = setInterval(() => load(false, isActive), 10000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [load]);

  const visible = tasks.filter(
    (t) =>
      t.assigned_to === user.id &&
      (filter === 'All' || t.status === filter)
  );

  const markDone = async (task) => {
    if (pendingIds.includes(task.id)) return;

    const previousStatus = task.status;

    setError('');
    mutationVersion.current += 1;

    setPendingIds((ids) => [...ids, task.id]);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: 'Done' } : t
      )
    );

    try {
      const updated = await api.updateStatus(token, task.id, 'Done');
      const updatedTask = updated.task ?? updated;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, ...updatedTask } : t
        )
      );
    } catch (e) {
      // Rollback: คืนสถานะเดิมถ้า server บันทึกไม่สำเร็จ
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: previousStatus } : t
        )
      );

      setError('อัปเดตไม่สำเร็จ');
    } finally {
      mutationVersion.current += 1;

      setPendingIds((ids) =>
        ids.filter((id) => id !== task.id)
      );
    }
  };

  return (
    <div className="page">
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>To Do</option>
        <option>Done</option>
      </select>

      {loading && <p>กำลังโหลด...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            {t.title} — {t.status}

            {t.status !== 'Done' && (
              <button
                onClick={() => markDone(t)}
                disabled={pendingIds.includes(t.id)}
              >
                เปลี่ยนเป็น Done
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
