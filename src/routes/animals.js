const express = require('express');
const router = express.Router();
const db = require('../db');
const { attachNestedRoutes } = require('./nestedFactory');

router.get('/', (req, res) => {
  const category = req.query.category;
  let animals;
  if (category === 'ayam' || category === 'ikan') {
    animals = db.prepare('SELECT * FROM animals WHERE category = ? ORDER BY created_at DESC').all(category);
  } else {
    animals = db.prepare('SELECT * FROM animals ORDER BY created_at DESC').all();
  }
  res.render('animals/list', { animals, category: category || '' });
});

router.get('/new', (req, res) => {
  res.render('animals/form', { animal: null, defaultCategory: req.query.category || 'ayam' });
});

router.post('/', (req, res) => {
  const { category, name, breed, quantity, start_date, status, notes } = req.body;
  db.prepare(`INSERT INTO animals (category, name, breed, quantity, start_date, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(category, name, breed || null, Number(quantity) || 0, start_date || null, status || 'aktif', notes || null);
  res.redirect('/ternak?category=' + category);
});

router.get('/:id', (req, res) => {
  const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(req.params.id);
  if (!animal) return res.status(404).send('Ternak tidak ditemukan');
  const logs = db.prepare(`SELECT * FROM logs WHERE ref_type='animal' AND ref_id=? ORDER BY log_date DESC, id DESC`).all(animal.id);
  const breeding = db.prepare(`SELECT * FROM breeding_cycles WHERE animal_id=? ORDER BY created_at DESC`).all(animal.id);
  const reminders = db.prepare(`SELECT * FROM reminders WHERE ref_type='animal' AND ref_id=? ORDER BY due_date ASC`).all(animal.id);
  const finance = db.prepare(`SELECT * FROM finance WHERE ref_type='animal' AND ref_id=? ORDER BY trans_date DESC`).all(animal.id);
  res.render('animals/detail', { animal, logs, breeding, reminders, finance });
});

router.get('/:id/edit', (req, res) => {
  const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(req.params.id);
  if (!animal) return res.status(404).send('Ternak tidak ditemukan');
  res.render('animals/form', { animal, defaultCategory: animal.category });
});

router.put('/:id', (req, res) => {
  const { category, name, breed, quantity, start_date, status, notes } = req.body;
  db.prepare(`UPDATE animals SET category=?, name=?, breed=?, quantity=?, start_date=?, status=?, notes=? WHERE id=?`)
    .run(category, name, breed || null, Number(quantity) || 0, start_date || null, status, notes || null, req.params.id);
  res.redirect('/ternak/' + req.params.id);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM animals WHERE id = ?').run(req.params.id);
  db.prepare(`DELETE FROM logs WHERE ref_type='animal' AND ref_id=?`).run(req.params.id);
  db.prepare(`DELETE FROM reminders WHERE ref_type='animal' AND ref_id=?`).run(req.params.id);
  db.prepare(`DELETE FROM finance WHERE ref_type='animal' AND ref_id=?`).run(req.params.id);
  db.prepare(`DELETE FROM breeding_cycles WHERE animal_id=?`).run(req.params.id);
  res.redirect('/ternak');
});

// Siklus bertelur -> mengeram -> menetas -> dipanen (khusus ternak, terutama ayam)
router.post('/:id/breeding', (req, res) => {
  const { laying_date, eggs_count } = req.body;
  db.prepare(`INSERT INTO breeding_cycles (animal_id, laying_date, eggs_count, status)
    VALUES (?, ?, ?, 'bertelur')`).run(req.params.id, laying_date || null, eggs_count ? Number(eggs_count) : null);
  res.redirect('/ternak/' + req.params.id);
});

router.put('/:id/breeding/:breedingId', (req, res) => {
  const { status, incubation_start_date, expected_hatch_date, hatch_date, hatched_count, harvest_date, harvested_count, notes } = req.body;
  db.prepare(`UPDATE breeding_cycles SET status=?, incubation_start_date=?, expected_hatch_date=?, hatch_date=?, hatched_count=?, harvest_date=?, harvested_count=?, notes=?
    WHERE id=? AND animal_id=?`).run(
    status,
    incubation_start_date || null,
    expected_hatch_date || null,
    hatch_date || null,
    hatched_count !== '' && hatched_count != null ? Number(hatched_count) : null,
    harvest_date || null,
    harvested_count !== '' && harvested_count != null ? Number(harvested_count) : null,
    notes || null,
    req.params.breedingId,
    req.params.id
  );
  res.redirect('/ternak/' + req.params.id);
});

router.delete('/:id/breeding/:breedingId', (req, res) => {
  db.prepare('DELETE FROM breeding_cycles WHERE id=? AND animal_id=?').run(req.params.breedingId, req.params.id);
  res.redirect('/ternak/' + req.params.id);
});

attachNestedRoutes(router, 'animal');

module.exports = router;
