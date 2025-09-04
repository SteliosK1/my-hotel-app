import { z } from "zod";

export const hotelCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amenitiesCsv: z.string().optional(), // θα το σπάσουμε σε array
});
export type HotelCreateForm = z.infer<typeof hotelCreateSchema>;
