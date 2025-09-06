import { Heading } from "@chakra-ui/react";
import HotelForm from "../../../ui/HotelForm";
import {
  hotelCreateSchema,
  type HotelCreateForm,
} from "../validationSchema/hotelCreateSchema";
import { useCreateHotelMutation } from "../../../data-access/useCreateMutation";
import { useNavigate } from "react-router-dom";
import { useToastify } from "@/lib/useToastify";

export default function HotelCreatePage() {
  const nav = useNavigate();
  const m = useCreateHotelMutation();
  const t = useToastify();

  const onSubmit = async (values: HotelCreateForm) => {
    try {
      const created = await m.mutateAsync({
        name: values.name,
        description: values.description,
        amenities: values.amenities ?? [],
      });

      // navigate με το πραγματικό id από το API
      if (created?.id) {
        t.ok("Hotel created", created.name);
        nav(`/hotels/${created.id}`);
      } else {
        // fallback αν κάτι πήγε στραβά με το response
        t.ok("Hotel created");
        nav("/hotels");
      }
    } catch (e: any) {
      t.bad(
        "Create failed",
        e?.response?.data?.message ?? e?.message ?? "Unknown error"
      );
    }
  };

  return (
    <>
      <Heading mb={4}>Create Hotel</Heading>
      <HotelForm
        schema={hotelCreateSchema}
        onSubmit={onSubmit}
        submitText="Create"
        amenitiesAsCheckboxes
        // καθαρό initial state
        defaultValues={{ name: "", description: "", amenities: [] }}
        // αν το HotelForm το υποστηρίζει, δείχνει loading στο κουμπί
        isSubmitting={m.isPending}
      />
    </>
  );
}
