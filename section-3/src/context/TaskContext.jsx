
import { createContext, useContext, useState } from "react";

import {
  getTasks,
  createTask,
  updateTaskStatus
} from "../api/mockApi";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // โหลด Task จาก Mock API
  async function loadTasks(user) {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks(user);
      setTasks(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // สร้าง Task ใหม่
  async function addTask(data, user) {
    setLoading(true);
    setError("");

    try {
      const newTask = await createTask(data, user);

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask
      ]);

      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // เปลี่ยนสถานะ Task เป็น Done
  async function completeTask(taskId, user) {
    setLoading(true);
    setError("");

    try {
      const updatedTask = await updateTaskStatus(
        taskId,
        user
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      );

      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // ล้างข้อความ Error
  function clearError() {
    setError("");
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        loadTasks,
        addTask,
        completeTask,
        clearError
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Hook สำหรับเรียกใช้ TaskContext
export function useTasks() {
  return useContext(TaskContext);
}
