// src/features/hotels/feature/create/HotelCreatePage.tsx
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import HotelForm from "../../../ui/HotelForm";
import { hotelSchema, type HotelFormValues } from "../../../schemas/hotelSchema";
import { useHotelSave } from "../../../hooks/useHotelSave";

export default function HotelCreatePage() {
  const { onSubmit, isSubmitting } = useHotelSave();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Hotel
      </Typography>

      <HotelForm
        schema={hotelSchema}
        onSubmit={onSubmit}
        submitText="Create"
        amenitiesAsCheckboxes
        defaultValues={{ name: "", description: "", amenities: [] } as HotelFormValues}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
