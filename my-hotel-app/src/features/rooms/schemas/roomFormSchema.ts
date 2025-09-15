import { z } from "zod";

export const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["SINGLE", "DOUBLE", "SUITE", "FAMILY"], {
    required_error: "Type is required",
  }),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0"),
  isAvailable: z.coerce.boolean().default(true),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
