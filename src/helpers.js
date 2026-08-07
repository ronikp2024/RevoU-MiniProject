function getRefLabel(db, ref_type, ref_id) {
  if (!ref_type || !ref_id) return 'Umum';
  if (ref_type === 'animal') {
    const a = db.prepare('SELECT name, category FROM animals WHERE id = ?').get(ref_id);
    return a ? `${a.name} (${a.category})` : '(dihapus)';
  }
  if (ref_type === 'plant') {
    const p = db.prepare('SELECT name FROM plants WHERE id = ?').get(ref_id);
    return p ? p.name : '(dihapus)';
  }
  return 'Umum';
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

function formatCurrency(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

module.exports = { getRefLabel, addDays, formatCurrency };
