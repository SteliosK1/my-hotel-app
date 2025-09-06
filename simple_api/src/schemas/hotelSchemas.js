const { z } = require('zod');

// Hotel validation schemas
const createHotelSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(200),
  amenities: z.array(z.string()).default([])
});

const updateHotelSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(200).optional(),
  amenities: z.array(z.string()).optional()
});

const hotelIdSchema = z.object({
  id: z.string().min(1)
});

module.exports = {
  createHotelSchema,
  updateHotelSchema,
  hotelIdSchema
};
