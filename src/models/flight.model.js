import { run, all, get } from "../config/db.js";

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

export function listFlights({ origin, destination, date } = {}) {
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
    // matches YYYY-MM-DD at start of departure_time
    sql += ` AND substr(departure_time, 1, 10) = ?`;
    params.push(date);
  }

  sql += ` ORDER BY departure_time ASC`;
  return all(sql, params);
}

export function getFlightById(id) {
  return get(`SELECT * FROM flights WHERE id = ?`, [id]);
}
