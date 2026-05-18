import { createFlight, listFlights } from "../models/flight.model.js";
import { formatDateTime, displayTimezone } from "../utils/time.js";
import { createAuditLog } from "../models/auditLog.model.js";

export function showFlights(req, res) {
  const { origin = "", destination = "", date = "" } = req.query;

  const flights = listFlights({
    origin,
    destination,
    date,
    futureOnly: true,
  });

  const formattedFlights = flights.map((flight) => ({
    ...flight,
    departure_time_display: formatDateTime(flight.departure_time),
    arrival_time_display: formatDateTime(flight.arrival_time),
  }));

  res.render("pages/flights", {
    title: "Flights",
    flights: formattedFlights,
    filters: { origin, destination, date },
    displayTimezone,
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
  const { origin, destination, departure_time, arrival_time, price, total_seats } =
    req.validated?.body || req.body;

  try {
    createFlight({
      origin,
      destination,
      departure_time,
      arrival_time,
      price,
      total_seats,
    });

    createAuditLog({
      user_id: req.session.user.id,
      action: "flight_created",
      metadata: {
        origin,
        destination,
        departure_time,
        arrival_time,
        price,
        total_seats,
      },
    });

    req.flash("success", "Flight created successfully.");
    return res.redirect("/flights");
  } catch (err) {
    req.flash("error", "Could not create flight. Please try again.");
    return res.redirect("/admin/flights/new");
  }
}