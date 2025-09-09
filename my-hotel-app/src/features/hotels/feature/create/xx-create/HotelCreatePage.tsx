import { Heading } from "@chakra-ui/react";
import HotelForm from "../../../ui/HotelForm";
import { hotelSchema, type HotelFormValues } from "../../../schemas/hotelSchema";
import { useHotelSave } from "../../../hooks/useHotelSave";

export default function HotelCreatePage() {
  const { onSubmit, isSubmitting } = useHotelSave();

  return (
    <>
      <Heading mb={4}>Create Hotel</Heading>
      <HotelForm
        schema={hotelSchema}
        onSubmit={onSubmit}
        submitText="Create"
        amenitiesAsCheckboxes
        defaultValues={{ name: "", description: "", amenities: [] } as HotelFormValues}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
