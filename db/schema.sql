PRAGMA foreign_keys = ON;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- FLIGHTS
CREATE TABLE IF NOT EXISTS flights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  price REAL NOT NULL CHECK (price >= 0),
  total_seats INTEGER NOT NULL CHECK (total_seats >= 1),
  available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  flight_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_flights_route ON flights(origin, destination);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_flight ON bookings(flight_id);
