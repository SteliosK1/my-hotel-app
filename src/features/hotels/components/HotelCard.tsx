import { Card, Heading, Text, Stack, Badge } from "@chakra-ui/react";
import type { Hotel } from "../domain/hotel";
import { Link as RouterLink } from "react-router-dom";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <RouterLink to={`/hotels/${hotel.id}`}>
      <Card.Root p={4} _hover={{ shadow: "sm" }} cursor="pointer">
        <Card.Body>
          <Stack gap={2}>
            <Heading size="md">{hotel.name}</Heading>
            {hotel.description && <Text>{hotel.description}</Text>}
            <Stack direction="row" wrap="wrap" gap={2}>
              {hotel.amenities.map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </RouterLink>
  );
}
