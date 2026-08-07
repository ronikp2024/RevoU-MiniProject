const db = require('../db');
const { addDays } = require('../helpers');

function basePath(refType) {
  return refType === 'animal' ? 'ternak' : 'kebun';
}

// Attaches shared "logs / reminders / finance" sub-resource routes onto a
// router mounted at /ternak or /kebun, since animals and plants both need
// the same daily-log, schedule, and expense/income tracking underneath them.
function attachNestedRoutes(router, refType) {
  const base = basePath(refType);

  router.post('/:id/logs', (req, res) => {
    const { log_date, type, quantity, unit, description } = req.body;
    db.prepare(`INSERT INTO logs (ref_type, ref_id, log_date, type, quantity, unit, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(refType, req.params.id, log_date, type, quantity ? Number(quantity) : null, unit || null, description || null);
    res.redirect(`/${base}/${req.params.id}`);
  });

  router.delete('/:id/logs/:logId', (req, res) => {
    db.prepare(`DELETE FROM logs WHERE id=? AND ref_type=? AND ref_id=?`).run(req.params.logId, refType, req.params.id);
    res.redirect(`/${base}/${req.params.id}`);
  });

  router.post('/:id/reminders', (req, res) => {
    const { title, due_date, repeat_interval_days, notes } = req.body;
    db.prepare(`INSERT INTO reminders (ref_type, ref_id, title, due_date, repeat_interval_days, notes)
      VALUES (?, ?, ?, ?, ?, ?)`).run(refType, req.params.id, title, due_date, repeat_interval_days ? Number(repeat_interval_days) : null, notes || null);
    res.redirect(`/${base}/${req.params.id}`);
  });

  router.put('/:id/reminders/:reminderId/done', (req, res) => {
    const reminder = db.prepare('SELECT * FROM reminders WHERE id=? AND ref_type=? AND ref_id=?').get(req.params.reminderId, refType, req.params.id);
    if (reminder) {
      db.prepare('UPDATE reminders SET is_done=1 WHERE id=?').run(reminder.id);
      if (reminder.repeat_interval_days) {
        const next = addDays(reminder.due_date, reminder.repeat_interval_days);
        db.prepare(`INSERT INTO reminders (ref_type, ref_id, title, due_date, repeat_interval_days, notes)
          VALUES (?, ?, ?, ?, ?, ?)`).run(refType, req.params.id, reminder.title, next, reminder.repeat_interval_days, reminder.notes);
      }
    }
    res.redirect(`/${base}/${req.params.id}`);
  });

  router.delete('/:id/reminders/:reminderId', (req, res) => {
    db.prepare('DELETE FROM reminders WHERE id=? AND ref_type=? AND ref_id=?').run(req.params.reminderId, refType, req.params.id);
    res.redirect(`/${base}/${req.params.id}`);
  });

  router.post('/:id/finance', (req, res) => {
    const { trans_date, type, category, amount, notes } = req.body;
    db.prepare(`INSERT INTO finance (ref_type, ref_id, trans_date, type, category, amount, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(refType, req.params.id, trans_date, type, category || null, Number(amount) || 0, notes || null);
    res.redirect(`/${base}/${req.params.id}`);
  });

  router.delete('/:id/finance/:financeId', (req, res) => {
    db.prepare('DELETE FROM finance WHERE id=? AND ref_type=? AND ref_id=?').run(req.params.financeId, refType, req.params.id);
    res.redirect(`/${base}/${req.params.id}`);
  });
}

module.exports = { attachNestedRoutes };
