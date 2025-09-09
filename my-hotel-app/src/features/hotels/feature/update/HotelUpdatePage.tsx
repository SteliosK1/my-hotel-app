import { Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import HotelForm from "../../ui/HotelForm";
import { hotelSchema, type HotelFormValues } from "../../schemas/hotelSchema";
import { useHotelQuery } from "../../data-access/useHotelQuery";
import { useHotelSave } from "../../hooks/useHotelSave";

export default function HotelUpdatePage() {
  const { id = "" } = useParams();
  const { data: hotel, isLoading, isError } = useHotelQuery(id);
  const { onSubmit, isSubmitting } = useHotelSave({ id });

  if (isLoading) return <div>Loading…</div>;
  if (isError || !hotel) return <div>Not found</div>;

  const defaults: HotelFormValues = {
    name: hotel.name ?? "",
    description: hotel.description ?? "",
    amenities: (hotel.amenities ?? []) as HotelFormValues["amenities"],
  };

  return (
    <>
      <Heading mb={4}>Edit Hotel</Heading>
      <HotelForm
        schema={hotelSchema}
        onSubmit={onSubmit}
        submitText="Update"
        amenitiesAsCheckboxes
        defaultValues={defaults}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
