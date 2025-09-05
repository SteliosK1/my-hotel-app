// src/features/hotels/components/HotelCard.tsx
import {
  Card,
  Heading,
  Text,
  Stack,
  Badge,
  HStack,
  Button,
} from "@chakra-ui/react";
import type { Hotel } from "../domain/hotel";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const nav = useNavigate();
  const shown = hotel.amenities.slice(0, 3);
  const extra = Math.max(0, hotel.amenities.length - shown.length);

  return (
    <Card.Root
      h="full"                                 // 👈 ίσο ύψος
      p={4}
      _hover={{ shadow: "md", cursor: "pointer" }}
      transition="box-shadow 150ms"
      display="flex"
      flexDirection="column"
      onClick={() => nav(`/hotels/${hotel.id}`)}  // 👈 όλη η κάρτα clickable
      role="link"
      aria-label={`Open ${hotel.name} details`}
    >
      {/* Body: γεμίζει τον χώρο */}
      <Stack gap={2} flex="1">
        <Heading size="md">{hotel.name}</Heading>

        {hotel.description && (
          <Text lineClamp={3}>{hotel.description}</Text>  // 👈 max 3 γραμμές
        )}

        {/* σταθερός χώρος για badges για να μη «πηδάνε» τα κουμπιά */}
        <HStack wrap="wrap" gap={2} minH="36px">
          {shown.map((a) => (
            <Badge key={a}>{a}</Badge>
          ))}
          {extra > 0 && <Badge>+{extra} more</Badge>}
        </HStack>
      </Stack>

      {/* Footer: πάντα στο κάτω μέρος */}
      <HStack gap={2} pt={4}>
        <RouterLink to={`/hotels/${hotel.id}`}>
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "gray.900" }}
            _active={{ bg: "gray.800" }}
            onClick={(e) => e.stopPropagation()}  // 👈 να μην ανοίγει η κάρτα
          >
            View Details
          </Button>
        </RouterLink>

        <RouterLink to={`/hotels/${hotel.id}/edit`}>
          <Button
            bg="#D1D0D0"
            color="black"
            _hover={{ bg: "#bfbfbf" }}
            _active={{ bg: "#a6a6a6" }}
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Button>
        </RouterLink>
      </HStack>
    </Card.Root>
  );
}
