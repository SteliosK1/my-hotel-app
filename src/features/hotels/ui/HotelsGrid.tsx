import { SimpleGrid } from "@chakra-ui/react";
import HotelCard from "../components/HotelCard";
import type { Hotel } from "../domain/hotel";

export default function HotelsGrid({ hotels }: { hotels: Hotel[] }) {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4}>
      {hotels.map((h) => <HotelCard key={h.id} hotel={h} />)}
    </SimpleGrid>
  );
}
