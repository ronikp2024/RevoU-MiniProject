const express = require('express');
const router = express.Router();
const db = require('../db');
const { getRefLabel } = require('../helpers');

router.get('/', (req, res) => {
  const counts = {
    ayam: db.prepare(`SELECT COALESCE(SUM(quantity),0) as total FROM animals WHERE category='ayam' AND status='aktif'`).get().total,
    ikan: db.prepare(`SELECT COALESCE(SUM(quantity),0) as total FROM animals WHERE category='ikan' AND status='aktif'`).get().total,
    kebun: db.prepare(`SELECT COUNT(*) as total FROM plants WHERE status='tumbuh'`).get().total,
  };

  const month = new Date().toISOString().slice(0, 7);
  const financeRows = db.prepare(`SELECT type, amount FROM finance WHERE trans_date LIKE ?`).all(month + '%');
  const finance = financeRows.reduce((acc, r) => {
    if (r.type === 'pemasukan') acc.income += r.amount;
    else acc.expense += r.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const upcomingReminders = db.prepare(`SELECT * FROM reminders WHERE is_done=0 ORDER BY due_date ASC LIMIT 6`).all()
    .map(r => ({ ...r, label: getRefLabel(db, r.ref_type, r.ref_id) }));

  const activeBreeding = db.prepare(`SELECT b.*, a.name as animal_name FROM breeding_cycles b
    JOIN animals a ON a.id = b.animal_id
    WHERE b.status NOT IN ('dipanen','gagal') ORDER BY b.created_at DESC LIMIT 6`).all();

  res.render('dashboard', { counts, finance, upcomingReminders, activeBreeding });
});

module.exports = router;
