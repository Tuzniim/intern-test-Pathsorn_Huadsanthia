
# 2.1 Tech Stack

เทคโนโลยีที่ใช้ในการพัฒนา Task Management Web Application ในส่วนที่ 3 ประกอบด้วยภาษาโปรแกรม Framework และ Library ดังนี้

| เทคโนโลยี | ประเภท | เหตุผลที่เลือกใช้ |
|---|---|---|
| JavaScript | Programming Language | ใช้พัฒนาการทำงานของหน้าเว็บ เช่น การจัดการข้อมูลผู้ใช้ การตรวจสอบ Role และการเปลี่ยนสถานะ Task |
| React.js | JavaScript Library | ใช้สร้างส่วนติดต่อผู้ใช้แบบ Components โดยแยกหน้า Login, Admin และ Employee ออกจากกัน ทำให้จัดการและแก้ไขแต่ละส่วนได้ง่าย |
| Vite | Build Tool | ใช้เริ่มต้นและรันโปรเจกต์ React รวมถึงช่วยให้การทดสอบและแก้ไขหน้าเว็บระหว่างพัฒนาทำได้รวดเร็ว |
| React Router DOM | Routing Library | ใช้จัดการเส้นทางระหว่างหน้า Login, Admin และ Employee รวมถึงควบคุมการเข้าถึงหน้าตาม Role ของผู้ใช้ |
| React Context API | State Management | ใช้จัดการและแชร์ข้อมูลผู้ใช้ สถานะ Login และฟังก์ชัน Logout ระหว่าง Components |
| localStorage | Browser Storage | ใช้จัดเก็บข้อมูลผู้ใช้และสถานะ Login เพื่อให้ระบบจดจำการเข้าสู่ระบบได้แม้ Refresh หน้าเว็บ |
| CSS | Styling Language | ใช้กำหนดรูปแบบและการจัดวางองค์ประกอบต่าง ๆ เช่น หน้า Login และ Dashboard ให้เหมาะสมกับการใช้งาน |
| Git | Version Control | ใช้ติดตามการเปลี่ยนแปลงของ Source Code และจัดเก็บประวัติการพัฒนาผ่าน Commit |
| GitHub | Code Hosting Platform | ใช้จัดเก็บ Source Code ของโปรเจกต์บน Repository เพื่อให้สามารถเข้าถึงและตรวจสอบประวัติการพัฒนาได้ |

## สรุปความเหมาะสมกับโจทย์

เทคโนโลยีที่เลือกใช้รองรับการพัฒนา Task Management Web Application ที่มีผู้ใช้งาน 2 บทบาท ได้แก่ Admin และ Employee โดย React ช่วยแยกส่วนการทำงานของแต่ละหน้า React Router DOM ใช้ควบคุมการเข้าถึงหน้าตามสิทธิ์ของผู้ใช้ และ React Context API ร่วมกับ localStorage ช่วยจัดการและจดจำสถานะการเข้าสู่ระบบ ทำให้สามารถพัฒนาระบบ Login และ Role-Based Access Control ได้ตามข้อกำหนดของโจทย์
