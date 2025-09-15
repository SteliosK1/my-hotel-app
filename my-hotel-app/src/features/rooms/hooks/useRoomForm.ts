import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RoomFormValues } from "../schemas/roomFormSchema";
import { roomFormSchema } from "../schemas/roomFormSchema";

type Params = {
  initialValues?: Partial<RoomFormValues>;
  onSubmit: (values: RoomFormValues) => Promise<void> | void;
};

export function useRoomForm({ initialValues, onSubmit }: Params) {
  const defaultValues = useMemo<RoomFormValues>(() => {
    return {
      roomNumber: initialValues?.roomNumber ?? "",
      type: (initialValues?.type as RoomFormValues["type"]) ?? "SINGLE",
      pricePerNight:
        typeof initialValues?.pricePerNight === "number"
          ? initialValues.pricePerNight
          : (initialValues?.pricePerNight as unknown as number) ?? ("" as any),
      isAvailable:
        typeof initialValues?.isAvailable === "boolean"
          ? initialValues.isAvailable
          : true,
    };
  }, [initialValues]);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return { form, handleSubmit };
}
