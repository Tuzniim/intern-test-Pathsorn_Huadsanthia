
import { users } from "../data/users";
import { projects } from "../data/projects";
import { initialTasks } from "../data/tasks";

// เก็บ Task ไว้ในหน่วยความจำ
let tasks = [...initialTasks];

// จำลองการ Login
export function login(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.username === username
      );

      if (!user) {
        reject(new Error("Username not found"));
        return;
      }

      resolve(user);
    }, 1000);
  });
}

// ดึงรายการ Task
export function getTasks(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!user) {
        reject(new Error("User not found"));
        return;
      }

      const result =
        user.role === "admin"
          ? tasks
          : tasks.filter(
              (task) => task.assignedTo === user.id
            );

      resolve([...result]);
    }, 800);
  });
}

// สร้าง Task ใหม่ (Admin เท่านั้น)
export function createTask(data, user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user?.role !== "admin") {
        reject(new Error("Permission denied"));
        return;
      }

      if (!data.title?.trim()) {
        reject(new Error("Task title is required"));
        return;
      }

      const employee = users.find(
        (u) =>
          u.id === Number(data.assignedTo) &&
          u.role === "employee"
      );

      if (!employee) {
        reject(new Error("Invalid employee"));
        return;
      }

      const project = projects.find(
        (p) => p.id === Number(data.projectId)
      );

      if (!project) {
        reject(new Error("Invalid project"));
        return;
      }

      const newTask = {
        id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
        projectId: Number(data.projectId),
        title: data.title.trim(),
        assignedTo: employee.id,
        status: "To Do"
      };

      tasks = [...tasks, newTask];

      resolve(newTask);
    }, 1000);
  });
}

// เปลี่ยนสถานะ Task เป็น Done
export function updateTaskStatus(taskId, user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!user || user.role !== "employee") {
        reject(new Error("Permission denied"));
        return;
      }

      const task = tasks.find(
        (t) => t.id === Number(taskId)
      );

      if (!task) {
        reject(new Error("Task not found"));
        return;
      }

      if (task.assignedTo !== user.id) {
        reject(new Error("You cannot update this task"));
        return;
      }

      if (task.status !== "To Do") {
        reject(new Error("Task is already Done"));
        return;
      }

      const updatedTask = {
        ...task,
        status: "Done"
      };

      tasks = tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      );

      resolve(updatedTask);
    }, 800);
  });
}
