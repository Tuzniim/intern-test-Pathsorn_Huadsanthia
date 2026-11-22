import { createContext, useContext, useState } from "react";
import { mockLogin } from "../api/mockApi";

// สร้าง Context
const AuthContext = createContext();

// โหลดข้อมูลผู้ใช้ที่เคย Login ไว้
const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// Provider สำหรับแชร์ข้อมูลผู้ใช้
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ฟังก์ชัน Login
  const login = async (username) => {
    setLoading(true);
    setError("");

    try {
      const result = await mockLogin(username);

      setUser(result);

      // บันทึกข้อมูลผู้ใช้ลง localStorage
      localStorage.setItem("user", JSON.stringify(result));

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชัน Logout
  const logout = () => {
    setUser(null);
    setError("");

    // ลบข้อมูลผู้ใช้ออกจาก localStorage
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับเรียกใช้ข้อมูล Context
export function useAuth() {
  return useContext(AuthContext);
}