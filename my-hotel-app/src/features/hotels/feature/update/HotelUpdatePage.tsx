// src/features/hotels/feature/update/HotelUpdatePage.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

import HotelForm from "../../ui/HotelForm";
import { hotelSchema, type HotelFormValues } from "../../schemas/hotelSchema";
import { useHotelQuery } from "../../data-access/useHotelQuery";
import { useHotelSave } from "../../hooks/useHotelSave";

export default function HotelUpdatePage() {
  const { id = "" } = useParams();
  const { data: hotel, isLoading, isError } = useHotelQuery(id);
  const { onSubmit, isSubmitting } = useHotelSave({ id });

  if (isLoading) return <Typography variant="body2">Loading…</Typography>;
  if (isError || !hotel) return <Typography variant="body2">Not found</Typography>;

  const defaults: HotelFormValues = {
    name: hotel.name ?? "",
    description: hotel.description ?? "",
    amenities: (hotel.amenities ?? []) as HotelFormValues["amenities"],
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Hotel
      </Typography>

      <HotelForm
        schema={hotelSchema}
        onSubmit={onSubmit}
        submitText="Update"
        amenitiesAsCheckboxes
        defaultValues={defaults}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
