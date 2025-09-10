const { z } = require('zod');

// Room Types
const ROOM_TYPES = ['SINGLE', 'DOUBLE', 'SUITE', 'FAMILY'];

// Base room schema for validation
const roomBaseSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").max(10),
  type: z.enum(ROOM_TYPES, { 
    required_error: "Room type is required",
    invalid_type_error: "Invalid room type" 
  }),
  pricePerNight: z.number().min(0, "Price must be positive"),
  isAvailable: z.boolean().default(true)
});

// Create room schema (requires hotelId)
const createRoomSchema = roomBaseSchema.extend({
  hotelId: z.string().min(1, "Hotel ID is required")
});

// Update room schema (all fields optional)
const updateRoomSchema = roomBaseSchema.partial();

// Room ID validation
const roomIdSchema = z.object({
  id: z.string().min(1, "Room ID is required")
});

// Room query filters
const roomQuerySchema = z.object({
  hotelId: z.string().optional(),
  type: z.enum(ROOM_TYPES).optional(),
  isAvailable: z.boolean().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional()
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  roomIdSchema,
  roomQuerySchema,
  ROOM_TYPES
};
