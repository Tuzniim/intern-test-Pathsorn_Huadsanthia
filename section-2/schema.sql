

-- =====================================
-- 1. USERS
-- =====================================
CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    role         TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- ใช้รองรับ Composite Foreign Key
    UNIQUE (id, role)
);


-- =====================================
-- 2. PROJECTS
-- =====================================
CREATE TABLE projects (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================
-- 3. TASKS
-- =====================================
CREATE TABLE tasks (
    id          BIGSERIAL PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       VARCHAR(300) NOT NULL,
    assigned_to BIGINT,
    assignee_role TEXT DEFAULT 'employee'
        CHECK (assignee_role = 'employee'),
    status      TEXT NOT NULL DEFAULT 'To Do'
        CHECK (status IN ('To Do', 'Done')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- ป้องกันการมอบหมาย Task ให้ Admin
    FOREIGN KEY (assigned_to, assignee_role)
        REFERENCES users(id, role)
        ON DELETE SET NULL (assigned_to)
);


-- =====================================
-- 4. AUDIT LOG
-- =====================================
CREATE TABLE audit_log (
    id          BIGSERIAL PRIMARY KEY,
    task_id     BIGINT,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    action      VARCHAR(50) NOT NULL,
    old_status  TEXT,
    new_status  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================
-- 5. UPDATE UPDATED_AT AUTOMATICALLY
-- =====================================
CREATE OR REPLACE FUNCTION update_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_task_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_task_timestamp();


-- =====================================
-- 6. INDEXES
-- =====================================

-- Employee: ค้นหา Task ของตัวเอง
CREATE INDEX idx_tasks_assignee_created
ON tasks (assigned_to, created_at DESC);

-- Admin: ค้นหา Task ตาม Project
CREATE INDEX idx_tasks_project_created
ON tasks (project_id, created_at DESC);

-- Audit Log: ดูประวัติของ Task
CREATE INDEX idx_audit_task
ON audit_log (task_id, created_at);

-- Login: username มี UNIQUE INDEX อยู่แล้ว
