import { all, get, run } from "../config/db.js";

export function createFlight(flight) {
  const {
    origin,
    destination,
    departure_time,
    arrival_time,
    price,
    total_seats,
  } = flight;

  return run(
    `INSERT INTO flights (origin, destination, departure_time, arrival_time, price, total_seats, available_seats)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [origin, destination, departure_time, arrival_time, price, total_seats, total_seats]
  );
}

export function listFlights({ origin, destination, date, futureOnly = false } = {}) {
  let sql = `SELECT * FROM flights WHERE 1=1`;
  const params = [];

  if (origin) {
    sql += ` AND lower(origin) LIKE ?`;
    params.push(`%${origin.toLowerCase()}%`);
  }

  if (destination) {
    sql += ` AND lower(destination) LIKE ?`;
    params.push(`%${destination.toLowerCase()}%`);
  }

  if (date) {
    // departure_time stored like "YYYY-MM-DDTHH:mm" from datetime-local
    sql += ` AND substr(departure_time, 1, 10) = ?`;
    params.push(date);
  }

  if (futureOnly) {
    // Compare as ISO-like strings. Works if stored as "YYYY-MM-DDTHH:mm"
    const now = new Date().toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    sql += ` AND departure_time > ?`;
    params.push(now);
  }

  sql += ` ORDER BY departure_time ASC`;
  return all(sql, params);
}

export function getFlightById(id) {
  return get(`SELECT * FROM flights WHERE id = ?`, [id]);
}
