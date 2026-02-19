import { createFlight, listFlights } from "../models/flight.model.js";

export function showFlights(req, res) {
  const { origin = "", destination = "", date = "" } = req.query;

  const flights = listFlights({ origin, destination, date });

  res.render("pages/flights", {
    title: "Flights",
    flights,
    filters: { origin, destination, date },
  });
}

export function showNewFlightForm(req, res) {
  res.render("pages/admin/new-flight", {
    title: "Create Flight",
    errors: [],
    form: {
      origin: "",
      destination: "",
      departure_time: "",
      arrival_time: "",
      price: "",
      total_seats: "",
    },
  });
}

export function createNewFlight(req, res) {
  const { origin, destination, departure_time, arrival_time, price, total_seats } = req.body;

  const errors = [];
  const o = (origin || "").trim();
  const d = (destination || "").trim();
  const dep = (departure_time || "").trim();
  const arr = (arrival_time || "").trim();

  const p = Number(price);
  const seats = Number(total_seats);

  if (!o) errors.push("Origin is required.");
  if (!d) errors.push("Destination is required.");
  if (!dep) errors.push("Departure time is required.");
  if (!arr) errors.push("Arrival time is required.");
  if (!Number.isFinite(p) || p < 0) errors.push("Price must be a valid non-negative number.");
  if (!Number.isInteger(seats) || seats < 1) errors.push("Total seats must be an integer >= 1.");

  // optional: basic time sanity check if ISO datetime-local is used
  if (dep && arr && dep >= arr) errors.push("Arrival time must be after departure time.");

  if (errors.length > 0) {
    return res.status(400).render("pages/admin/new-flight", {
      title: "Create Flight",
      errors,
      form: { origin: o, destination: d, departure_time: dep, arrival_time: arr, price, total_seats },
    });
  }

  createFlight({
    origin: o,
    destination: d,
    departure_time: dep,
    arrival_time: arr,
    price: p,
    total_seats: seats,
  });

  return res.redirect("/flights");
}
