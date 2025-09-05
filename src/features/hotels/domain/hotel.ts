import { z } from "zod";

export const hotelBaseSchema = z.object({
  name: z.string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z.string({ required_error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be at most 200 characters"),
  amenities: z.array(z.string().trim()).default([]),
});

export const hotelSchema = hotelBaseSchema.extend({
  id: z.string(),
});

export type Hotel = z.infer<typeof hotelSchema>;
export type HotelCreateInput = z.infer<typeof hotelBaseSchema>;
export type HotelUpdateInput = Partial<HotelCreateInput>;
