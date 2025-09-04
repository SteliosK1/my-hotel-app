import { z } from "zod";

export const hotelUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amenitiesCsv: z.string().optional(),
});

export type HotelUpdateForm = z.infer<typeof hotelUpdateSchema>;
