import { z } from "zod";
import { AMENITY_OPTIONS } from "../../../constants/amenities";

const AmenityEnum = z.enum(AMENITY_OPTIONS);

export const hotelUpdateSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be at most 200 characters"),
  amenities: z.array(AmenityEnum).default([]),
});

export type HotelUpdateForm = z.infer<typeof hotelUpdateSchema>;
