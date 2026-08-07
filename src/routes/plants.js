const express = require('express');
const router = express.Router();
const db = require('../db');
const { attachNestedRoutes } = require('./nestedFactory');

router.get('/', (req, res) => {
  const plants = db.prepare('SELECT * FROM plants ORDER BY created_at DESC').all();
  res.render('plants/list', { plants });
});

router.get('/new', (req, res) => {
  res.render('plants/form', { plant: null });
});

router.post('/', (req, res) => {
  const { name, variety, quantity, planting_date, status, notes } = req.body;
  db.prepare(`INSERT INTO plants (name, variety, quantity, planting_date, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)`).run(name, variety || null, quantity || null, planting_date || null, status || 'tumbuh', notes || null);
  res.redirect('/kebun');
});

router.get('/:id', (req, res) => {
  const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);
  if (!plant) return res.status(404).send('Tanaman tidak ditemukan');
  const logs = db.prepare(`SELECT * FROM logs WHERE ref_type='plant' AND ref_id=? ORDER BY log_date DESC, id DESC`).all(plant.id);
  const reminders = db.prepare(`SELECT * FROM reminders WHERE ref_type='plant' AND ref_id=? ORDER BY due_date ASC`).all(plant.id);
  const finance = db.prepare(`SELECT * FROM finance WHERE ref_type='plant' AND ref_id=? ORDER BY trans_date DESC`).all(plant.id);
  res.render('plants/detail', { plant, logs, reminders, finance });
});

router.get('/:id/edit', (req, res) => {
  const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);
  if (!plant) return res.status(404).send('Tanaman tidak ditemukan');
  res.render('plants/form', { plant });
});

router.put('/:id', (req, res) => {
  const { name, variety, quantity, planting_date, status, notes } = req.body;
  db.prepare(`UPDATE plants SET name=?, variety=?, quantity=?, planting_date=?, status=?, notes=? WHERE id=?`)
    .run(name, variety || null, quantity || null, planting_date || null, status, notes || null, req.params.id);
  res.redirect('/kebun/' + req.params.id);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM plants WHERE id = ?').run(req.params.id);
  db.prepare(`DELETE FROM logs WHERE ref_type='plant' AND ref_id=?`).run(req.params.id);
  db.prepare(`DELETE FROM reminders WHERE ref_type='plant' AND ref_id=?`).run(req.params.id);
  db.prepare(`DELETE FROM finance WHERE ref_type='plant' AND ref_id=?`).run(req.params.id);
  res.redirect('/kebun');
});

attachNestedRoutes(router, 'plant');

module.exports = router;
