// src/features/rooms/hooks/useRoomForm.ts
import { useMemo, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomFormSchema, type RoomFormValues } from "../schemas/roomFormSchema";

/** Params για το hook που χρησιμοποιείται με FormContainer (Elements) */
export type UseRoomFormElementsParams = {
  initialValues?: Partial<RoomFormValues>;
  onSubmit: (values: RoomFormValues) => Promise<void> | void;
};

/** Return shape που “κουμπώνει” στο <FormContainer ...> */
export type UseRoomFormElementsReturn = {
  /** Πέρνα το στο <FormContainer resolver={...} /> */
  resolver: ReturnType<typeof zodResolver>;
  /** Πέρνα το στο <FormContainer defaultValues={...} /> */
  defaultValues: RoomFormValues | Record<string, unknown>;
  /** Πέρνα το στο <FormContainer onSuccess={...} /> */
  onSuccess: (values: unknown) => Promise<void>;
};

/**
 * Hook για react-hook-form-mui Elements.
 * Δίνει resolver/defaultValues/onSuccess έτοιμα για το <FormContainer/>.
 */
export function useRoomFormElements({
  initialValues,
  onSubmit,
}: UseRoomFormElementsParams): UseRoomFormElementsReturn {
  const defaultValues = useMemo<RoomFormValues | Record<string, unknown>>(
    () => ({
      roomNumber: initialValues?.roomNumber ?? "",
      type: (initialValues?.type as RoomFormValues["type"]) ?? "SINGLE",
      // κρατά number αν υπάρχει, αλλιώς άφησε κενό για ωραίο TextField
      pricePerNight:
        typeof initialValues?.pricePerNight === "number"
          ? initialValues.pricePerNight
          : (initialValues?.pricePerNight as any) ?? "",
      isAvailable: Boolean(initialValues?.isAvailable),
    }),
    [initialValues]
  );

  const resolver = zodResolver(roomFormSchema);

  const onSuccess = useCallback(
    async (values: unknown) => {
      const v = values as RoomFormValues;
      v.roomNumber = String(v.roomNumber).trim();
      await onSubmit(v);
    },
    [onSubmit]
  );

  return { resolver, defaultValues, onSuccess };
}
