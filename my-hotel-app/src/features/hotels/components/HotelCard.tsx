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

  // ✅ ΠΑΝΤΑ array – αν έρθει undefined/null, το κάνουμε []
  const amenities: string[] = Array.isArray(hotel.amenities) ? hotel.amenities : [];
  const shown = amenities.slice(0, 3);
  const extra = Math.max(0, amenities.length - shown.length);

  return (
    <Card.Root
      h="full"
      p={4}
      _hover={{ shadow: "md", cursor: "pointer" }}
      transition="box-shadow 150ms"
      display="flex"
      flexDirection="column"
      onClick={() => nav(`/hotels/${hotel.id}`)}
      role="link"
      aria-label={`Open ${hotel.name} details`}
    >
      <Stack gap={2} flex="1">
        <Heading size="md">{hotel.name}</Heading>

        {hotel.description && <Text lineClamp={3}>{hotel.description}</Text>}

        <HStack wrap="wrap" gap={2} minH="36px">
          {shown.map((a) => (
            <Badge key={a}>{a}</Badge>
          ))}
          {extra > 0 && <Badge>+{extra} more</Badge>}
        </HStack>
      </Stack>

      <HStack gap={2} pt={4}>
        <RouterLink to={`/hotels/${hotel.id}`}>
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "gray.900" }}
            _active={{ bg: "gray.800" }}
            onClick={(e) => e.stopPropagation()}
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
