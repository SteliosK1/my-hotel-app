import {
    Field,
    Input,
    // Select,
    Checkbox,
    HStack,
    Button,
    Heading,
  } from "@chakra-ui/react";
  import { Controller } from "react-hook-form";
  import { Select } from "@chakra-ui/select";
  import type { UseFormReturn } from "react-hook-form";
  import type { RoomFormValues } from "../schemas/roomFormSchema";
  type Props = {
    form: UseFormReturn<RoomFormValues>;
    title: string;
    submitLabel: string;
    onCancel: () => void;
    submitting?: boolean;
  };
  import { ROOM_TYPES } from "../../rooms/constants/roomTypes";

  export function RoomFormFields({
    form,
    title,
    submitLabel,
    onCancel,
    submitting,
  }: Props) {
    const {
      register,
      control,
      formState: { errors },
    } = form;
  
    // Δημιουργούμε collection για το Chakra Select (ίδια λογική με το επίσημο demo)

    return (
      <>
        <Heading id="room-form-title" size="md" style={{ marginBottom: 16 }}>
          {title}
        </Heading>
  
        {/* Room Number */}
        <Field.Root invalid={!!errors.roomNumber} required>
          <Field.Label>Room Number</Field.Label>
          <Input placeholder="e.g. 101" {...register("roomNumber")} />
          {errors.roomNumber && (
            <Field.ErrorText>{errors.roomNumber.message}</Field.ErrorText>
          )}
        </Field.Root>
  
      {/* Type */}
        <Field.Root invalid={!!errors.type} required style={{ marginTop: 12 }}>
        <Field.Label>Type</Field.Label>

        <Controller
            control={control}
            name="type"
            render={({ field }) => (
            <Select
                placeholder="Select room type"
                size="md"
                bg="white"
                borderColor="gray.300"
                focusBorderColor="blue.500"
                {...field}
            >
                {ROOM_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
                ))}
            </Select>
            )}
        />

        {errors.type && <Field.ErrorText>{errors.type.message}</Field.ErrorText>}
        </Field.Root>

        {/* Price */}
        <Field.Root
          invalid={!!errors.pricePerNight}
          required
          style={{ marginTop: 12 }}
        >
          <Field.Label>Price per Night</Field.Label>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="e.g. 120"
            // valueAsNumber για να μη σπάει σε NaN/coercion
            {...register("pricePerNight", { valueAsNumber: true })}
          />
          {errors.pricePerNight && (
            <Field.ErrorText>{errors.pricePerNight.message}</Field.ErrorText>
          )}
        </Field.Root>
  
        {/* Available */}
        <Field.Root style={{ marginTop: 12 }}>
          <Controller
            control={control}
            name="isAvailable"
            render={({ field }) => (
              <Checkbox.Root
                checked={!!field.value}
                onCheckedChange={({ checked }) => field.onChange(!!checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Available</Checkbox.Label>
              </Checkbox.Root>
            )}
          />
        </Field.Root>
  
        {/* Actions */}
        <HStack justify="flex-end" mt={6} gap={3}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {/* NOTE: στο δικό σου setup το prop είναι `loading`, όχι `isLoading` */}
          <Button colorScheme="blue" type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </HStack>
      </>
    );
  }
