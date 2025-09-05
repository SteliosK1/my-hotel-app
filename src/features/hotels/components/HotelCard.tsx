// src/features/hotels/components/HotelCard.tsx
import { Card, Heading, Text, Stack, Badge, HStack, Button } from "@chakra-ui/react";
import type { Hotel } from "../domain/hotel";
import { Link as RouterLink } from "react-router-dom";

function truncate(s: string, n = 80) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const shownAmenities = hotel.amenities.slice(0, 3);
  const extraCount = Math.max(0, hotel.amenities.length - shownAmenities.length);

  return (
    // ✅ Τύλιγμα ΜΕ RouterLink (όχι as=)
    <RouterLink to={`/hotels/${hotel.id}`}>
      <Card.Root p={4} _hover={{ shadow: "md" }} cursor="pointer">
        <Card.Body>
          <Stack gap={3}>
            <Heading size="md">{hotel.name}</Heading>
            {hotel.description && <Text>{truncate(hotel.description, 100)}</Text>}

            <HStack wrap="wrap" gap={2}>
              {shownAmenities.map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
              {extraCount > 0 && <Badge>+{extraCount} more</Badge>}
            </HStack>

            {/* Προαιρετικά κρατάμε και κουμπιά — επίσης τυλιγμένα σε RouterLink */}
            <HStack gap={3} mt={2} onClick={(e) => e.stopPropagation()}>
              <RouterLink to={`/hotels/${hotel.id}`}>
                <Button>View Details</Button>
              </RouterLink>
              <RouterLink to={`/hotels/${hotel.id}/edit`}>
                <Button>Edit</Button>
              </RouterLink>
            </HStack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </RouterLink>
  );
}
