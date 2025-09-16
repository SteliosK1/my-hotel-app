// src/features/hotels/ui/HotelsGrid.tsx
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import type { Hotel } from "../domain/hotel";
import HotelCard from "../components/HotelCard";

type Props = {
  hotels: Hotel[];
};

/**
 * Masonry layout (MUI v7, @mui/lab):
 * - Responsive στήλες: 1 / 2 / 3
 * - Δεν χρησιμοποιεί καθόλου το Grid component
 */
export default function HotelsGrid({ hotels }: Props) {
  return (
    <Box sx={{ width: "100%" }}>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        spacing={3}
        defaultColumns={1}
        defaultHeight={450}
        defaultSpacing={2}
      >
        {hotels.map((h, i) => (
          <Box key={h.id ?? h.name ?? i} sx={{ width: "100%" }}>
            <HotelCard hotel={h} />
          </Box>
        ))}
      </Masonry>
    </Box>
  );
}
