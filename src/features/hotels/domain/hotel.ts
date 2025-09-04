import { z } from "zod";

export const hotelBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([]),
});

export const hotelSchema = hotelBaseSchema.extend({
  id: z.string(),
});

export type Hotel = z.infer<typeof hotelSchema>;
export type HotelCreateInput = z.infer<typeof hotelBaseSchema>;
export type HotelUpdateInput = Partial<HotelCreateInput>;
