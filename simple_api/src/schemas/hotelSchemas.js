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

const pagePaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(v => (v ? Number(v) : 1))
    .refine(n => Number.isInteger(n) && n >= 1, { message: 'page must be an integer ≥ 1' }),
  per_page: z
    .string()
    .optional()
    .transform(v => (v ? Number(v) : 10))
    .refine(n => Number.isInteger(n) && n >= 1 && n <= 100, {
      message: 'per_page must be an integer between 1 and 100',
    }),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

module.exports = {
  createHotelSchema,
  updateHotelSchema,
  hotelIdSchema,
  pagePaginationQuerySchema
};
