// src/features/hotels/ui/HotelsGrid.tsx
import { SimpleGrid, Box } from "@chakra-ui/react";
import type { Hotel } from "../domain/hotel";
import HotelCard from "../components/HotelCard";

export default function HotelsGrid({ hotels }: { hotels: Hotel[] }) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      gap={6}
      alignItems="stretch"           // 👈 όλα τα children ίδιο ύψος
    >
      {hotels.map((h) => (
        <Box key={h.id} h="full">  
          <HotelCard hotel={h} />
        </Box>
      ))}
    </SimpleGrid>
  );
}
