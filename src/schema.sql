CREATE TABLE IF NOT EXISTS animals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK(category IN ('ayam','ikan')),
  name TEXT NOT NULL,
  breed TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  status TEXT NOT NULL DEFAULT 'aktif' CHECK(status IN ('aktif','dijual','mati','selesai')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  variety TEXT,
  quantity TEXT,
  planting_date TEXT,
  status TEXT NOT NULL DEFAULT 'tumbuh' CHECK(status IN ('tumbuh','panen','gagal')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_type TEXT NOT NULL CHECK(ref_type IN ('animal','plant')),
  ref_id INTEGER NOT NULL,
  log_date TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity REAL,
  unit TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_logs_ref ON logs(ref_type, ref_id);

CREATE TABLE IF NOT EXISTS breeding_cycles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  laying_date TEXT,
  eggs_count INTEGER,
  incubation_start_date TEXT,
  expected_hatch_date TEXT,
  hatch_date TEXT,
  hatched_count INTEGER,
  harvest_date TEXT,
  harvested_count INTEGER,
  status TEXT NOT NULL DEFAULT 'bertelur' CHECK(status IN ('bertelur','mengeram','menetas','dipanen','gagal')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_breeding_animal ON breeding_cycles(animal_id);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_type TEXT CHECK(ref_type IN ('animal','plant')),
  ref_id INTEGER,
  title TEXT NOT NULL,
  due_date TEXT NOT NULL,
  repeat_interval_days INTEGER,
  is_done INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(due_date, is_done);

CREATE TABLE IF NOT EXISTS finance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_type TEXT CHECK(ref_type IN ('animal','plant')),
  ref_id INTEGER,
  trans_date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('pengeluaran','pemasukan')),
  category TEXT,
  amount REAL NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_finance_date ON finance(trans_date);
