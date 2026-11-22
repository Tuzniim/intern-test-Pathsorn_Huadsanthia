
import { createContext, useContext, useState } from "react";
import { login as loginAPI } from "../api/mockApi";

// สร้าง Context สำหรับเก็บข้อมูลผู้ใช้งาน
const AuthContext = createContext(null);

// Provider สำหรับแชร์ข้อมูลให้ทุกหน้า
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ฟังก์ชัน Login
  async function signIn(username) {
    const loggedInUser = await loginAPI(username);

    setUser(loggedInUser);

    return loggedInUser;
  }

  // ฟังก์ชัน Logout
  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับเรียกใช้งานข้อมูล Auth
export function useAuth() {
  return useContext(AuthContext);
}
