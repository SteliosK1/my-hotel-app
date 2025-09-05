import { Heading } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import HotelForm from "../../ui/HotelForm";
import { hotelUpdateSchema, type HotelUpdateForm } from "./validationSchema/hotelUpdateSchema";
import { useHotelQuery } from "../../data-access/useHotelQuery";
import { useUpdateHotelMutation } from "../../data-access/useUpdateMutation";
import { useToastify } from "@/lib/useToastify";   // 👈 import

export default function HotelUpdatePage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { data: hotel, isLoading } = useHotelQuery(id);
  const m = useUpdateHotelMutation();
  const t = useToastify();   // 👈 instance

  if (isLoading) return <p>Loading…</p>;
  if (!hotel) return <p>Hotel not found</p>;

  const defaultValues = {
    name: hotel.name,
    description: hotel.description,
    amenitiesCsv: hotel.amenities.join(", "),
  };

  const onSubmit = async (values: HotelUpdateForm) => {
    try {
      const amenities = (values.amenitiesCsv ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await m.mutateAsync({
        id,
        input: { name: values.name, description: values.description, amenities },
      });

      // ✅ Toast success
      t.ok("Hotel updated", updated.name);

      nav(`/hotels/${updated.id}`);
    } catch (e: any) {
      // ✅ Toast error
      t.bad("Update failed", e.message);
    }
  };

  return (
    <>
      <Heading mb={4}>Edit Hotel</Heading>
      <HotelForm
        schema={hotelUpdateSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update"
      />
    </>
  );
}
