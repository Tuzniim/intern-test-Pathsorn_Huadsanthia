const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const ALLOWED_STATUSES = ['To Do', 'Done'];
const PAGE_SIZE = 20;

router.get('/api/tasks', authenticate, async (req, res) => {
  const { projectId } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  if (projectId !== undefined && !Number.isInteger(Number(projectId))) {
    return res.status(400).json({ message: 'Invalid projectId' });
  }

  try {
    const where = [];
    const params = [];
    if (projectId !== undefined) {
      params.push(Number(projectId));
      where.push(`project_id = $${params.length}`);
    }
    if (req.user.role !== 'admin') {
      params.push(req.user.id);
      where.push(`assigned_to = $${params.length}`);
    }
    params.push(PAGE_SIZE, offset);
    const sql =
      'SELECT * FROM tasks' +
      (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
      ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(sql, params);
    return res.status(200).json({ tasks: result.rows, page });
  } catch (err) {
    console.error('GET /api/tasks failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/api/tasks/:id/status', authenticate, async (req, res) => {
  const taskId = Number(req.params.id);
  const status = req.body && req.body.status;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = rows[0];
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = task.assigned_to === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'No permission to edit this task' });
    }
    // employee ทำได้เฉพาะ To Do -> Done
    if (!isAdmin && !(task.status === 'To Do' && status === 'Done')) {
      return res.status(409).json({ message: 'Employees can only change To Do to Done' });
    }

    // UPDATE + audit_log ใน statement เดียว (atomic) และกัน race ด้วยสถานะเดิม
    const result = await db.query(
      `WITH upd AS (
         UPDATE tasks SET status = $1, updated_at = NOW()
         WHERE id = $2 AND status = $3
         RETURNING *
       ), log AS (
         INSERT INTO audit_log (task_id, user_id, action)
         SELECT id, $4, $5 FROM upd
       )
       SELECT * FROM upd`,
      [status, taskId, task.status, req.user.id, `status:${status}`]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'Task was changed by someone else' });
    }
    return res.status(200).json({ task: result.rows[0] });
  } catch (err) {
    console.error('PATCH /api/tasks/:id/status failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/api/tasks/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/tasks/:id failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
