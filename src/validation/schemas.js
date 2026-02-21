import { z } from "zod";
import { nowLocalIso16 } from "../utils/time.js";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const createFlightSchema = z
  .object({
    origin: z.string().trim().min(1, "Origin is required."),
    destination: z.string().trim().min(1, "Destination is required."),
    departure_time: z.string().min(1, "Departure time is required."),
    arrival_time: z.string().min(1, "Arrival time is required."),
    price: z.coerce.number().positive("Price must be greater than 0."),
    total_seats: z.coerce.number().int().positive("Total seats must be a positive integer."),
  })
  .superRefine((v, ctx) => {
    const now = nowLocalIso16();

    if (v.departure_time <= now) {
      ctx.addIssue({
        code: "custom",
        path: ["departure_time"],
        message: "Departure time must be in the future.",
      });
    }

    if (v.arrival_time <= v.departure_time) {
      ctx.addIssue({
        code: "custom",
        path: ["arrival_time"],
        message: "Arrival time must be after departure time.",
      });
    }
  });

// IDs: adjust if your DB uses UUIDs instead of ints
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid id."),
});

export const bookingIdParamSchema = z.object({
  booking_id: z.coerce.number().int().positive("Invalid booking id."),
});