import { z } from "zod";
import { AMENITY_OPTIONS } from "../../../constants/amenities";

const AmenityEnum = z.enum(AMENITY_OPTIONS);

export const hotelCreateSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(2).max(50),
  description: z.string({ required_error: "Description is required" }).trim().min(10).max(200),
  amenities: z.array(AmenityEnum).default([]),
});
export type HotelCreateForm = z.infer<typeof hotelCreateSchema>;
