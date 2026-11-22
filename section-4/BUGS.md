# BUGS.md

เอกสารรายงานข้อผิดพลาด (Bug Report) จากการตรวจสอบ Source Code โดยเรียงลำดับตามระดับความรุนแรงจากมากไปน้อย

## 1. รายการบั๊กที่ตรวจพบ

### Critical — วิกฤต

| # | ไฟล์ / บรรทัด | ประเภท | ปัญหา | วิธีแก้ไข |
|---:|---|---|---|---|
| 1 | `tasks.js:78-84` | Security | Route `DELETE` ไม่มี `authenticate` ทำให้ผู้ที่ไม่ได้ Login สามารถลบ Task ได้ เนื่องจาก `req.user` เป็น `undefined` และเงื่อนไขตรวจสอบสิทธิ์ถูกข้าม | เพิ่ม Middleware `authenticate` และตรวจสอบสิทธิ์ Admin |

**วิธีพิสูจน์**
- ส่ง `DELETE /api/tasks/1` โดยไม่แนบ Token
- ก่อนแก้ไข: ได้ HTTP `204` และ Task ถูกลบ
- หลังแก้ไข: ต้องได้ HTTP `401` และ Task ยังคงอยู่

---

### High — ความรุนแรงสูง

| # | ไฟล์ / บรรทัด | ประเภท | ปัญหา | วิธีแก้ไข |
|---:|---|---|---|---|
| 2 | `tasks.js:53` | Logic / Authorization | ใช้ `!isAdmin || !isOwner` ทำให้ Employee เจ้าของ Task และ Admin ที่ไม่ใช่เจ้าของถูกปฏิเสธสิทธิ์ | เปลี่ยนเป็น `!isAdmin && !isOwner` |
| 3 | `tasks.js:21-23` | Logic / SQL | เมื่อไม่ส่ง `projectId` SQL ที่สร้างขึ้นมี Syntax ผิด ทำให้ Employee เรียก API แล้วได้ HTTP 500 | สร้างเงื่อนไข SQL ด้วย Array และรวมด้วย `WHERE ... AND ...` |
| 4 | `EmployeeTasks.jsx:30-39` | UI / Logic | แก้ไข Object ใน State โดยตรงและใช้ Reference เดิม ทำให้ React อาจไม่ Re-render อีกทั้งไม่มี Rollback เมื่อ Server ทำงานผิดพลาด | ใช้ Immutable State Update พร้อม Optimistic Update และ Rollback |
| 5 | `EmployeeTasks.jsx:20-24` | Async / Resource Management | `setInterval` ไม่มี Cleanup ทำให้ยังเรียก API ทุก 10 วินาที แม้ผู้ใช้ออกจากหน้า Component แล้ว | เพิ่ม `clearInterval(timer)` ใน Cleanup ของ `useEffect` |
| 6 | `tasks.js:66-69` | Async / Data Consistency | `INSERT audit_log` ไม่มี `await` และไม่ได้ทำงานร่วมกับ UPDATE แบบ Atomic อาจทำให้สถานะ Task เปลี่ยน แต่ไม่มี Audit Log | รวม UPDATE และ INSERT ด้วย CTE หรือ Transaction |

**วิธีพิสูจน์**

**#2 ตรวจสอบสิทธิ์**
- Employee เจ้าของ Task #3 ส่ง `PATCH /api/tasks/3/status` พร้อม `{ "status": "Done" }`
- ก่อนแก้ไข: ได้ HTTP `403`
- หลังแก้ไข: ต้องได้ HTTP `200` และสถานะเปลี่ยนเป็น Done

**#3 ตรวจสอบ SQL**
- Employee เรียก `GET /api/tasks` โดยไม่ส่ง Query
- ก่อนแก้ไข: ได้ HTTP `500`
- หลังแก้ไข: ต้องได้ HTTP `200` และเห็นเฉพาะ Task ของตัวเอง

**#4 ตรวจสอบ State**
- กดปุ่มเปลี่ยนสถานะ Task
- ก่อนแก้ไข: UI อาจไม่แสดงสถานะใหม่ทันที
- หลังแก้ไข: ต้องแสดง Done ทันที และหาก Server ตอบ HTTP `500` ต้อง Rollback กลับเป็น To Do พร้อมข้อความ Error

**#5 ตรวจสอบ Cleanup**
- เปิดหน้า Employee แล้วเปลี่ยนไปหน้าอื่น
- ก่อนแก้ไข: ยังพบ Request `GET /api/tasks` ทุก 10 วินาที
- หลังแก้ไข: ต้องหยุด Request เมื่อออกจากหน้า

**#6 ตรวจสอบ Audit Log**
- จำลองให้ INSERT `audit_log` ล้มเหลว
- ก่อนแก้ไข: อาจได้ HTTP `200` ทั้งที่ไม่มี Audit Log
- หลังแก้ไข: ต้องได้ HTTP `500` และสถานะ Task ต้องไม่เปลี่ยน

---

### Medium — ความรุนแรงปานกลาง

| # | ไฟล์ / บรรทัด | ประเภท | ปัญหา | วิธีแก้ไข |
|---:|---|---|---|---|
| 7 | `tasks.js:57-59` | Logic / Validation | Employee สามารถส่งสถานะ To Do ไปยัง Task ที่เป็น To Do อยู่แล้ว ทำให้เกิด Audit Log ที่ไม่จำเป็น | อนุญาตให้ Employee เปลี่ยนได้เฉพาะ `To Do` → `Done` |
| 8 | `EmployeeTasks.jsx:22, 30-39` | Async / Race Condition | Polling ที่เริ่มก่อนกดปุ่มอาจตอบกลับทีหลังและนำข้อมูลเก่ามาทับสถานะใหม่ | ใช้ `useRef` เก็บ Version และทิ้งผล Polling ที่เริ่มก่อนการเปลี่ยนแปลง |
| 9 | `tasks.js:44-71` | Async / Race Condition | ตรวจสอบสถานะและ UPDATE แยกกัน อาจเกิด Race Condition เมื่อมี Request พร้อมกัน ทำให้บันทึก Audit ซ้ำ | ใช้ Conditional UPDATE ด้วย `WHERE id = $2 AND status = $3` และตรวจสอบจำนวนแถวที่ได้รับผลกระทบ |
| 10 | `EmployeeTasks.jsx:12-18` | Async / Error Handling | `getTasks` ไม่มี `catch/finally` เมื่อ Request ล้มเหลวอาจเกิด Unhandled Promise Rejection และ Loading ค้าง | ใช้ `try/catch/finally` เพื่อจัดการ Error และปิด Loading เสมอ |
| 11 | `tasks.js:9-10, 22, 25` | Validation / SQL | ไม่ตรวจสอบค่า Page อาจทำให้ OFFSET เป็น NaN หรือติดลบ และนำ LIMIT/OFFSET ไปต่อ SQL โดยตรง | Validate Page ให้เป็นจำนวนเต็มบวก และใช้ Parameterized Query |

**วิธีพิสูจน์**

**#7 ตรวจสอบ Validation**
- Employee ส่ง `{ "status": "To Do" }` ให้ Task ที่เป็น To Do อยู่แล้ว
- ก่อนแก้ไข: ได้ HTTP `200` และมี Audit Log เพิ่ม
- หลังแก้ไข: ต้องได้ HTTP `409`

**#8 ตรวจสอบ Race Condition ของ Polling**
- หน่วง `getTasks` เป็นเวลา 3 วินาที
- กดเปลี่ยนสถานะระหว่างที่ Request กำลังรอ
- ก่อนแก้ไข: ข้อมูลเก่าอาจทับสถานะ Done
- หลังแก้ไข: สถานะต้องยังคงเป็น Done

**#9 ตรวจสอบ Concurrent Request**
- ส่ง PATCH สอง Request พร้อมกันสำหรับ Task เดียวกัน
- ก่อนแก้ไข: อาจเกิด Audit Log ซ้ำ
- หลังแก้ไข: ต้องสำเร็จเพียง Request เดียว ส่วนอีก Request ได้ HTTP `409`

**#10 ตรวจสอบ Error Handling**
- จำลองให้ `getTasks` Reject
- ก่อนแก้ไข: Loading อาจค้างและเกิด Unhandled Promise Rejection
- หลังแก้ไข: Loading ต้องหยุดและแสดงข้อความ Error

**#11 ตรวจสอบ Pagination**
- ส่ง `GET /api/tasks?page=abc`
- ก่อนแก้ไข: อาจได้ HTTP `500`
- หลังแก้ไข: ต้องได้ HTTP `400` พร้อมข้อความ `Invalid page number`

---

### Low — ความรุนแรงต่ำ

| # | ไฟล์ / บรรทัด | ประเภท | ปัญหา | วิธีแก้ไข |
|---:|---|---|---|---|
| 12 | `tasks.js:36` | Input Validation | `taskId` ที่ไม่ใช่ตัวเลข เช่น `abc` จะกลายเป็น NaN และอาจทำให้เกิด Database Error | ตรวจสอบด้วย `Number.isSafeInteger(taskId)` และ `taskId > 0` |
| 13 | `EmployeeTasks.jsx:56` | React / UI | ใช้ `key={i}` ซึ่งเป็น Index อาจทำให้ React จับคู่รายการผิดเมื่อมีการกรองหรือเปลี่ยนลำดับ | เปลี่ยนเป็น `key={t.id}` |
| 14 | `EmployeeTasks.jsx:30-39, 57-59` | UI / Async | ไม่มีการป้องกันการกดปุ่มซ้ำระหว่างรอ API และไม่มีการล้าง Error เก่าก่อนเริ่มทำงานครั้งใหม่ | ใช้ `pendingIds` ป้องกันการกดซ้ำ และเรียก `setError('')` ก่อนเริ่มทำงาน |

**วิธีพิสูจน์**

- **#12:** ส่ง `PATCH /api/tasks/abc/status` ต้องได้ HTTP `400`
- **#13:** กรอง Task และเปลี่ยนสถานะรายการแรก ตรวจสอบว่ารายการที่เหลือยังแสดงข้อมูลถูกต้อง
- **#14:** กดปุ่มเดิมสองครั้งอย่างรวดเร็ว ต้องมี Request เพียงครั้งเดียว

---

## 2. จุดที่สงสัย (Potential Issues)

รายการต่อไปนี้เป็นประเด็นที่ควรตรวจสอบเพิ่มเติม แต่ยังไม่สามารถยืนยันว่าเป็นบั๊กได้จาก Source Code เพียงอย่างเดียว

### 2.1 การเปรียบเทียบชนิดข้อมูลของ `assigned_to`

**ไฟล์:** `EmployeeTasks.jsx:27`

```javascript
t.assigned_to === user.id
```

**ประเด็นที่สงสัย**
- PostgreSQL อาจส่งค่า `BIGINT` กลับมาเป็น String
- ขณะที่ `user.id` อาจเป็น Number
- การใช้ `===` จะไม่ตรงกันหากชนิดข้อมูลต่างกัน

**สิ่งที่ควรตรวจสอบ:** ตรวจสอบชนิดข้อมูลจริงของทั้งสองตัวแปรก่อนสรุปว่าเป็นบั๊ก

### 2.2 การตรวจสอบสิทธิ์เจ้าของ Task

**ไฟล์:** `tasks.js:51`

```javascript
task.assigned_to === req.user.id
```

**ประเด็นที่สงสัย**
- มีความเสี่ยงเรื่องชนิดข้อมูลไม่ตรงกันเช่นเดียวกับข้อ 2.1
- อาจทำให้เจ้าของ Task ถูกปฏิเสธสิทธิ์โดยไม่ตั้งใจ

**สิ่งที่ควรตรวจสอบ:** ตรวจสอบชนิดข้อมูลที่ได้จาก Database และ Authentication Middleware

### 2.3 การตรวจสอบ `projectId`

**ไฟล์:** `tasks.js:16-18`

**ประเด็นที่สงสัย**
- มีการใช้ Parameterized Query (`$n`) อยู่แล้ว จึงไม่ใช่ SQL Injection โดยตรง
- แต่ยังควรตรวจสอบ Input ว่าเป็นค่าที่ถูกต้องก่อนนำไปใช้ใน SQL

**สิ่งที่ควรตรวจสอบ:** ทดสอบการส่ง `projectId` ที่เป็น String, ค่าว่าง และค่าที่ไม่ใช่ตัวเลข

### 2.4 การใช้ `OFFSET` ใน SQL

**ไฟล์:** `tasks.js:25`

```javascript
OFFSET ${offset}
```

**ประเด็นที่สงสัย**
- ค่า Offset เกิดจากการคำนวณตัวเลข จึงไม่ใช่ SQL Injection โดยตรง
- ปัญหาหลักคือไม่มีการตรวจสอบค่า Page ซึ่งอาจทำให้ Offset เป็น NaN หรือติดลบ

**สิ่งที่ควรตรวจสอบ:** Validate ค่า Page และใช้ Parameterized Query สำหรับ LIMIT/OFFSET

### 2.5 Pagination จำกัด 20 รายการ

**ไฟล์:** `EmployeeTasks.jsx` และ API ที่เกี่ยวข้อง

**ประเด็นที่สงสัย**
- `api.getTasks(token)` ไม่ได้ส่งค่า `page` ไปยัง Backend
- หาก Employee มี Task มากกว่า 20 รายการ อาจเห็นข้อมูลไม่ครบทั้งหมด

**ข้อสรุป:** เป็นข้อจำกัดของ API ที่โจทย์กำหนดให้ใช้ ไม่ใช่บั๊กที่ต้องแก้ในไฟล์นี้

---

## 3. สรุปผลการตรวจสอบ

| ระดับความรุนแรง | จำนวน |
|---|---:|
| Critical | 1 |
| High | 5 |
| Medium | 5 |
| Low | 3 |
| **รวมบั๊กที่ตรวจพบ** | **14** |
