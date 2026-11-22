CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  display_name  VARCHAR(100) NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','employee')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE projects (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  created_by  BIGINT NOT NULL REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE tasks (
  id          BIGSERIAL PRIMARY KEY,
  project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       VARCHAR(300) NOT NULL,
  assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
  status      TEXT NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do','Done')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE audit_log (
  id         BIGSERIAL PRIMARY KEY,
  task_id    BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    BIGINT NOT NULL REFERENCES users(id),
  action     VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- รองรับ GET /api/tasks ของ employee: WHERE assigned_to=? ORDER BY created_at DESC LIMIT/OFFSET
CREATE INDEX idx_tasks_assignee_created ON tasks (assigned_to, created_at DESC);
-- รองรับ GET /api/tasks?projectId=? ของ admin เรียงล่าสุด
CREATE INDEX idx_tasks_project_created ON tasks (project_id, created_at DESC);
-- รองรับดูประวัติของ task: WHERE task_id=? ORDER BY created_at
CREATE INDEX idx_audit_task ON audit_log (task_id, created_at);
-- (users.username มี index จาก UNIQUE แล้ว รองรับ login lookup)
