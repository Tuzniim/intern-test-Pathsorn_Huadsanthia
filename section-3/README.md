# Section 3: User Guide
## Task Management Web Application

เอกสารนี้อธิบายวิธีติดตั้ง เริ่มต้นใช้งาน และวิธีใช้งานระบบ Task Management Web Application ซึ่งแบ่งผู้ใช้งานออกเป็น 2 บทบาท ได้แก่ Admin และ Employee

---

## 1. Requirements

เครื่องมือที่จำเป็นสำหรับการใช้งาน

- Node.js
- npm
- Web Browser เช่น Google Chrome
- Visual Studio Code (สำหรับแก้ไข Source Code)

## 2. Installation

1. เปิดโฟลเดอร์โปรเจกต์ `section-3` ด้วย Visual Studio Code
2. เปิด Terminal ภายในโปรเจกต์
3. ติดตั้ง Dependencies ด้วยคำสั่ง

```bash
npm install
```

4. รอจนกว่าการติดตั้งจะเสร็จสมบูรณ์

## 3. Start Application

1. เปิด Terminal ในโฟลเดอร์ `section-3`
2. รันคำสั่ง

```bash
npm run dev
```

3. รอจน Vite เริ่มทำงาน
4. เปิด Web Browser และเข้า URL

```text
http://localhost:5173
```

ระบบจะแสดงหน้า Login

## 4. Login

ผู้ใช้งานสามารถเลือกบัญชีจาก Dropdown เพื่อเข้าสู่ระบบ

บัญชีสำหรับทดสอบประกอบด้วย

| Username | Display Name | Role |
|---|---|---|
| admin | System Admin | Admin |
| employee1 | John | Employee |
| employee2 | Sarah | Employee |

ขั้นตอนการเข้าสู่ระบบ

1. เปิดหน้า Login
2. เลือกบัญชีผู้ใช้จาก Dropdown
3. กดปุ่ม Login
4. ระบบจะนำผู้ใช้ไปยังหน้าตาม Role ของบัญชี

## 5. Admin Usage

สำหรับผู้ใช้งานที่มี Role เป็น Admin

1. เลือกบัญชี `admin`
2. กดปุ่ม Login
3. ระบบจะนำไปยังหน้า Admin Dashboard
4. สามารถใช้งานส่วนจัดการงานตามฟังก์ชันที่ระบบกำหนด
5. เมื่อใช้งานเสร็จให้กด Logout เพื่อออกจากระบบ

## 6. Employee Usage

สำหรับผู้ใช้งานที่มี Role เป็น Employee

1. เลือกบัญชี `employee1` หรือ `employee2`
2. กดปุ่ม Login
3. ระบบจะนำไปยังหน้า Employee Dashboard
4. ดูรายการ Task ที่ได้รับมอบหมายในส่วน My Tasks
5. ตรวจสอบสถานะของแต่ละ Task
6. หาก Task มีสถานะ To Do สามารถกดปุ่ม Mark as Done เพื่อเปลี่ยนสถานะเป็น Done
7. เมื่อดำเนินการเสร็จสิ้นให้กด Logout

## 7. Role-Based Access Control

ระบบมีการตรวจสอบสิทธิ์การเข้าถึงหน้าตาม Role ของผู้ใช้งาน

| User Role | Accessible Page |
|---|---|
| Admin | `/admin` |
| Employee | `/employee` |

เงื่อนไขการเข้าถึง

- ผู้ใช้ที่ยังไม่ได้ Login จะถูก Redirect ไปยังหน้า Login
- ผู้ใช้ที่มี Role ไม่ตรงกับหน้าที่ต้องการเข้าถึง จะถูก Redirect กลับไปยัง Dashboard ของ Role ตนเอง
- ระบบจะแสดงข้อความแจ้งเตือนเมื่อผู้ใช้พยายามเข้าถึงหน้าที่ไม่มีสิทธิ์
- ผู้ใช้ที่มี Role ถูกต้องจึงจะสามารถเข้าถึงหน้าดังกล่าวได้

## 8. Login Persistence

ระบบใช้ `localStorage` เพื่อจดจำสถานะการเข้าสู่ระบบ

- เมื่อ Login สำเร็จ ระบบจะบันทึกข้อมูลผู้ใช้ลงใน `localStorage`
- เมื่อ Refresh หน้าเว็บ ระบบจะโหลดข้อมูลผู้ใช้ที่บันทึกไว้
- เมื่อ Logout ระบบจะลบข้อมูลผู้ใช้ออกจาก `localStorage`

## 9. Logout

ขั้นตอนการออกจากระบบ

1. กดปุ่ม Logout บน Dashboard
2. ระบบจะล้างข้อมูลผู้ใช้ที่เข้าสู่ระบบ
3. ผู้ใช้สามารถกลับไปเข้าสู่ระบบใหม่ได้

---

## 10. Notes

- ระบบในเวอร์ชันนี้ใช้ Mock API สำหรับจำลองการ Login และการจัดการ Task
- บัญชีผู้ใช้ใช้สำหรับทดสอบการทำงานของระบบ
- การจัดเก็บข้อมูล Login ด้วย `localStorage` เป็นการจำลองสำหรับการพัฒนา ไม่ใช่ระบบยืนยันตัวตนที่ปลอดภัยสำหรับใช้งานจริง
- ควร Logout หลังจากใช้งานเสร็จสิ้น