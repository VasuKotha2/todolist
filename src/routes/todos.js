const express = require('express');
const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const list = await db.listTodos();
      res.json(list);
    } catch (err) {
      req.log && req.log.error({ err }, 'failed to list todos');
      res.status(500).json({ error: 'internal' });
    }
  });

  router.post('/', async (req, res) => {
    const { title } = req.body || {};
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required' });
    }

    try {
      const todo = { id: uuidv4(), title: title.trim(), done: false };
      await db.createTodo(todo);
      res.status(201).json(todo);
    } catch (err) {
      req.log && req.log.error({ err }, 'failed to create todo');
      res.status(500).json({ error: 'internal' });
    }
  });

  return router;
};
