import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heading,
  Stack,
  Input,
  Textarea,
  Text,
  Button,
} from "@chakra-ui/react";

import { useHotelQuery } from "../../data-access/useHotelQuery";
import {
  hotelUpdateSchema,
  type HotelUpdateForm,
} from "./validationSchema/hotelUpdateSchema";
import { useHotelUpdateHandler } from "./useUpdateHandler/useHotelUpdateHandler";
import AmenityCheckboxGroup from "../../components/AmenityCheckboxGroup";

// 👇 import τα options & τον τύπο τους (literal union)
import { AMENITY_OPTIONS } from "../../constants/amenities";
import type { AmenityOption } from "../../constants/amenities";

// 👇 helper: μετατρέπει string[] από API -> AmenityOption[]
const sanitizeAmenities = (arr: string[] | undefined): AmenityOption[] => {
  const valid = new Set<typeof AMENITY_OPTIONS[number]>(AMENITY_OPTIONS);
  return (arr ?? []).filter((a): a is AmenityOption => valid.has(a as AmenityOption));
};


export default function HotelUpdatePage() {
  const { id = "" } = useParams();
  const { data: hotel, isLoading, isError } = useHotelQuery(id);
  const { onSubmit, isSubmitting } = useHotelUpdateHandler(id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
  } = useForm<HotelUpdateForm>({
    resolver: zodResolver(hotelUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
      amenities: [] as AmenityOption[], // ✅ σωστό default type
    },
  });

  // ✅ Pre-fill με sanitized amenities
  useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name ?? "",
        description: hotel.description ?? "",
        amenities: sanitizeAmenities(hotel.amenities),
      });
    }
  }, [hotel, reset]);

  if (isLoading) return <Text>Loading…</Text>;
  if (isError || !hotel) return <Text>Hotel not found</Text>;

  return (
    <>
      <Heading mb={4}>Edit Hotel</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3}>
          {/* Name */}
          <Input placeholder="Name" {...register("name")} />
          {errors.name && (
            <Text color="red.500" fontSize="sm">
              {String(errors.name.message)}
            </Text>
          )}

          {/* Description */}
          <Textarea placeholder="Description" {...register("description")} />
          {errors.description && (
            <Text color="red.500" fontSize="sm">
              {String(errors.description.message)}
            </Text>
          )}

          {/* Amenities (checkboxes) */}
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => (
              <AmenityCheckboxGroup
                value={(field.value ?? []) as AmenityOption[]}
                onChange={field.onChange}
              />
            )}
          />
          {errors.amenities && (
            <Text color="red.500" fontSize="sm">
              {String(errors.amenities.message)}
            </Text>
          )}

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting || formSubmitting}>
            {isSubmitting || formSubmitting ? "Updating…" : "Update"}
          </Button>
        </Stack>
      </form>
    </>
  );
}
