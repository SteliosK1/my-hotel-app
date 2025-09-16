// src/features/rooms/ui/RoomFormFields.tsx
import {
  Field,
  Input,
  HStack,
  Button,
  Heading,
  NativeSelect,
  Checkbox,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { RoomFormValues } from "../schemas/roomFormSchema";
import { ROOM_TYPES } from "../constants/roomTypes";

type Props = {
  form: UseFormReturn<RoomFormValues>;
  title?: string;
  submitLabel?: string;
  onCancel?: () => void;
  submitting?: boolean;
};

export function RoomFormFields({
  form,
  title = "Room",
  submitLabel = "Save",
  onCancel,
  submitting,
}: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Heading id="room-form-title" size="md" mb={4}>
        {title}
      </Heading>

      {/* Room Number */}
      <Field.Root invalid={!!errors.roomNumber} required mb={3}>
        <Field.Label>Room Number</Field.Label>
        <Input placeholder="e.g. 101" {...register("roomNumber")} />
        <Field.ErrorText>{errors.roomNumber?.message}</Field.ErrorText>
      </Field.Root>

      {/* Type (NativeSelect) */}
      <Field.Root invalid={!!errors.type} required mb={3}>
        <Field.Label>Type</Field.Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <NativeSelect.Root
              defaultValue={field.value ?? ""}
              onChange={(event) => field.onChange((event.target as HTMLSelectElement).value)}
            >
              <NativeSelect.Field>
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          )}
        />
        <Field.ErrorText>{errors.type?.message}</Field.ErrorText>
      </Field.Root>

      {/* Price per night */}
      <Field.Root invalid={!!errors.pricePerNight} required mb={3}>
        <Field.Label>Price per night</Field.Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...register("pricePerNight", { valueAsNumber: true })}
        />
        <Field.ErrorText>{errors.pricePerNight?.message}</Field.ErrorText>
      </Field.Root>

      {/* Availability */}
      {/* Availability */}
<Field.Root mb={4}>
  <Controller
    name="isAvailable"
    control={control}
    render={({ field: { value, onChange, ref, name } }) => (
      <Checkbox.Root
        checked={!!value}
        // Στο v3 ο handler παίρνει (checked: boolean | "indeterminate")
        onCheckedChange={({ checked }) => onChange(checked === true || checked === "indeterminate")}
      >
        <Checkbox.Control />
        <Checkbox.Label>Available</Checkbox.Label>
        {/* Κρατά τη σύνδεση με τα forms/RHF refs */}
        <Checkbox.HiddenInput ref={ref} name={name} />
      </Checkbox.Root>
    )}
  />
</Field.Root>


      <HStack justify="flex-end" gap={3}>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={!!submitting}>
          {submitLabel}
        </Button>
      </HStack>
    </>
  );
}
