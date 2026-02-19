import db from "../config/db.js";
import { nowLocalIso16 } from "../utils/time.js";

export function bookFlight({ user_id, flight_id }) {
  const tx = db.transaction(() => {
    // 1) Check seats
    const flight = db
      .prepare("SELECT id, available_seats, departure_time FROM flights WHERE id = ?")
      .get(flight_id);

    if (!flight) {
      return { ok: false, reason: "not_found" };
    }

    const now = nowLocalIso16();
    if (flight.departure_time <= now) {
      return { ok: false, reason: "too_late" };
    }

    if (flight.available_seats <= 0) {
      return { ok: false, reason: "sold_out" };
    }

    // 2) Insert booking
    const bookingResult = db
      .prepare(
        `INSERT INTO bookings (user_id, flight_id, status)
         VALUES (?, ?, 'confirmed')`
      )
      .run(user_id, flight_id);

    // 3) Decrement seats
    db.prepare(
      `UPDATE flights
       SET available_seats = available_seats - 1
       WHERE id = ? AND available_seats > 0`
    ).run(flight_id);

    return { ok: true, booking_id: bookingResult.lastInsertRowid };
  });

  return tx();
}

export function listBookingsByUser(user_id) {
  return db
    .prepare(
      `
      SELECT
        b.id AS booking_id,
        b.status,
        b.created_at AS booking_created_at,
        f.id AS flight_id,
        f.origin,
        f.destination,
        f.departure_time,
        f.arrival_time,
        f.price
      FROM bookings b
      JOIN flights f ON f.id = b.flight_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      `
    )
    .all(user_id);
}

export function cancelBooking({ booking_id, user_id }) {
  const tx = db.transaction(() => {
    // Get booking + flight info (ownership + status + departure time)
    const row = db
      .prepare(
        `
        SELECT
          b.id AS booking_id,
          b.user_id,
          b.status,
          f.id AS flight_id,
          f.departure_time
        FROM bookings b
        JOIN flights f ON f.id = b.flight_id
        WHERE b.id = ?
        `
      )
      .get(booking_id);

    if (!row) return { ok: false, reason: "not_found" };
    if (Number(row.user_id) !== Number(user_id)) return { ok: false, reason: "forbidden" };
    if (row.status !== "confirmed") return { ok: false, reason: "not_confirmed" };

    // Only allow cancel before departure (future)
    const now = nowLocalIso16();
    if (row.departure_time <= now) return { ok: false, reason: "too_late" };

    // Update booking status
    db.prepare(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`).run(booking_id);

    // Restore seat
    db.prepare(`UPDATE flights SET available_seats = available_seats + 1 WHERE id = ?`).run(row.flight_id);

    return { ok: true };
  });

  return tx();
}