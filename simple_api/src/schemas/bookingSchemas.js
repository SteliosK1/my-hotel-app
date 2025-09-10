const { z } = require('zod');

// Booking Status
const BOOKING_STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED'];

// Date validation helpers
const dateString = z.string().refine((date) => {
  return !isNaN(Date.parse(date));
}, {
  message: "Invalid date format"
});

// Base booking schema
const bookingBaseSchema = z.object({
  guestName: z.string().min(2, "Guest name must be at least 2 characters").max(100),
  guestEmail: z.string().email("Invalid email format"),
  checkIn: dateString,
  checkOut: dateString,
  status: z.enum(BOOKING_STATUS).default("PENDING")
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});

// Create booking schema (requires roomId)
const createBookingSchema = bookingBaseSchema.extend({
  roomId: z.string().min(1, "Room ID is required")
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  return checkIn >= today;
}, {
  message: "Check-in date cannot be in the past",
  path: ["checkIn"]
});

// Update booking schema (all fields optional except validation rules)
const updateBookingSchema = z.object({
  guestName: z.string().min(2).max(100).optional(),
  guestEmail: z.string().email().optional(),
  checkIn: dateString.optional(),
  checkOut: dateString.optional(),
  status: z.enum(BOOKING_STATUS).optional()
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  }
  return true;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});

// Booking ID validation
const bookingIdSchema = z.object({
  id: z.string().min(1, "Booking ID is required")
});

// Booking query filters
const bookingQuerySchema = z.object({
  roomId: z.string().optional(),
  hotelId: z.string().optional(),
  status: z.enum(BOOKING_STATUS).optional(),
  guestEmail: z.string().email().optional(),
  checkInFrom: dateString.optional(),
  checkInTo: dateString.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
});

// Room availability check schema
const roomAvailabilitySchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  checkIn: dateString,
  checkOut: dateString
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  bookingIdSchema,
  bookingQuerySchema,
  roomAvailabilitySchema,
  BOOKING_STATUS
};
