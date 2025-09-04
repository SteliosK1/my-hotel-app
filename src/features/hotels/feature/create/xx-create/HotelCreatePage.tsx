import { Heading } from "@chakra-ui/react";
import HotelForm from "../../../ui/HotelForm";
import { hotelCreateSchema, type HotelCreateForm } from "../validationSchema/hotelCreateSchema";
import { useCreateHotelMutation } from "../../../data-access/useCreateMutation";
import { useNavigate } from "react-router-dom";

export default function HotelCreatePage() {
  const nav = useNavigate();
  const m = useCreateHotelMutation();

  const onSubmit = async (values: HotelCreateForm) => {
    const amenities = (values.amenitiesCsv ?? "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const created = await m.mutateAsync({
      name: values.name,
      description: values.description,
      amenities,
    });

    nav(`/hotels/${created.id}`);
  };

  return (
    <>
      <Heading mb={4}>Create Hotel</Heading>
      <HotelForm schema={hotelCreateSchema} onSubmit={onSubmit} />
    </>
  );
}
