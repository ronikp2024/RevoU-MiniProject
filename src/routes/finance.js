const express = require('express');
const router = express.Router();
const db = require('../db');
const { getRefLabel } = require('../helpers');

router.get('/', (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const rows = db.prepare(`SELECT * FROM finance WHERE trans_date LIKE ? ORDER BY trans_date DESC`)
    .all(month + '%')
    .map(r => ({ ...r, label: getRefLabel(db, r.ref_type, r.ref_id) }));
  const totals = rows.reduce((acc, r) => {
    if (r.type === 'pemasukan') acc.income += r.amount;
    else acc.expense += r.amount;
    return acc;
  }, { income: 0, expense: 0 });
  res.render('finance/list', { rows, month, totals });
});

router.get('/new', (req, res) => {
  const animals = db.prepare('SELECT id, name, category FROM animals ORDER BY name').all();
  const plants = db.prepare('SELECT id, name FROM plants ORDER BY name').all();
  res.render('finance/form', { animals, plants });
});

router.post('/', (req, res) => {
  const { ref_type, ref_id, trans_date, type, category, amount, notes } = req.body;
  db.prepare(`INSERT INTO finance (ref_type, ref_id, trans_date, type, category, amount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(ref_type || null, ref_id || null, trans_date, type, category || null, Number(amount) || 0, notes || null);
  res.redirect('/keuangan');
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM finance WHERE id=?').run(req.params.id);
  res.redirect('/keuangan');
});

module.exports = router;
