// src/features/rooms/domain/roomSchema.ts
import { z } from "zod";

export const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["SINGLE", "DOUBLE", "SUITE", "FAMILY"], {
    required_error: "Type is required",
  }),
  pricePerNight: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  isAvailable: z.boolean().default(true),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
