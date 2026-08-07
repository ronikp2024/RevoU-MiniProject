const express = require('express');
const router = express.Router();
const db = require('../db');
const { getRefLabel, addDays } = require('../helpers');

router.get('/', (req, res) => {
  const filter = req.query.status || 'pending';
  let query = 'SELECT * FROM reminders';
  if (filter === 'pending') query += ' WHERE is_done = 0';
  else if (filter === 'done') query += ' WHERE is_done = 1';
  query += ' ORDER BY due_date ASC';
  const reminders = db.prepare(query).all().map(r => ({ ...r, label: getRefLabel(db, r.ref_type, r.ref_id) }));
  res.render('reminders/list', { reminders, filter });
});

router.get('/new', (req, res) => {
  const animals = db.prepare('SELECT id, name, category FROM animals ORDER BY name').all();
  const plants = db.prepare('SELECT id, name FROM plants ORDER BY name').all();
  res.render('reminders/form', { animals, plants });
});

router.post('/', (req, res) => {
  const { ref_type, ref_id, title, due_date, repeat_interval_days, notes } = req.body;
  db.prepare(`INSERT INTO reminders (ref_type, ref_id, title, due_date, repeat_interval_days, notes)
    VALUES (?, ?, ?, ?, ?, ?)`).run(ref_type || null, ref_id || null, title, due_date, repeat_interval_days ? Number(repeat_interval_days) : null, notes || null);
  res.redirect('/reminders');
});

router.put('/:id/done', (req, res) => {
  const reminder = db.prepare('SELECT * FROM reminders WHERE id=?').get(req.params.id);
  if (reminder) {
    db.prepare('UPDATE reminders SET is_done=1 WHERE id=?').run(reminder.id);
    if (reminder.repeat_interval_days) {
      const next = addDays(reminder.due_date, reminder.repeat_interval_days);
      db.prepare(`INSERT INTO reminders (ref_type, ref_id, title, due_date, repeat_interval_days, notes)
        VALUES (?, ?, ?, ?, ?, ?)`).run(reminder.ref_type, reminder.ref_id, reminder.title, next, reminder.repeat_interval_days, reminder.notes);
    }
  }
  res.redirect('/reminders');
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM reminders WHERE id=?').run(req.params.id);
  res.redirect('/reminders');
});

module.exports = router;
