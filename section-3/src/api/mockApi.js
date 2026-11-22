
import { users } from "../data/users";
import { initialTasks } from "../data/tasks";

// จำลองข้อมูลในหน่วยความจำ
let tasks = [...initialTasks];

// จำลองการเรียก API
const delay = (data, error = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(new Error(data));
      } else {
        resolve(data);
      }
    }, 1000);
  });
};

// 1. Login
export const mockLogin = async (username) => {
  const user = users.find(
    (u) => u.username === username
  );

  if (!user) {
    return delay("ไม่พบ Username ในระบบ", true);
  }

  return delay(user);
};

// 2. ดึง Task ทั้งหมด (Admin)
export const mockGetAllTasks = async () => {
  return delay([...tasks]);
};

// 3. ดึง Task ของ Employee
export const mockGetMyTasks = async (employeeId) => {
  const myTasks = tasks.filter(
    (task) => task.assignedTo === employeeId
  );

  return delay(myTasks);
};

// 4. สร้าง Task ใหม่ (Admin)
export const mockCreateTask = async (title, assignedTo) => {
  if (!title.trim()) {
    return delay("กรุณากรอกชื่องาน", true);
  }

  const newTask = {
    id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
    projectId: 1,
    title: title.trim(),
    assignedTo: Number(assignedTo),
    status: "To Do"
  };

  tasks = [...tasks, newTask];

  return delay(newTask);
};

// 5. เปลี่ยนสถานะ Task เป็น Done
export const mockCompleteTask = async (taskId, employeeId) => {
  const task = tasks.find(
    (t) => t.id === taskId
  );

  if (!task) {
    return delay("ไม่พบ Task", true);
  }

  if (task.assignedTo !== employeeId) {
    return delay("ไม่มีสิทธิ์แก้ไข Task นี้", true);
  }

  if (task.status === "Done") {
    return delay("Task นี้เสร็จแล้ว", true);
  }

  tasks = tasks.map((t) =>
    t.id === taskId
      ? { ...t, status: "Done" }
      : t
  );

  return delay(tasks.find((t) => t.id === taskId));
};
