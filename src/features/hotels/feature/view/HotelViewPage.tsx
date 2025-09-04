import { useParams, Link as RouterLink } from "react-router-dom";
import { Heading, Text, Button, Stack, Badge } from "@chakra-ui/react";
import { useHotelQuery } from "../../data-access/useHotelQuery";

export default function HotelViewPage() {
  const { id = "" } = useParams();
  const { data: hotel, isLoading } = useHotelQuery(id);

  if (isLoading) return <Text>Loading…</Text>;
  if (!hotel) return <Text>Not found</Text>;

  return (
    <Stack gap={3}>
      <Heading>{hotel.name}</Heading>
      {hotel.description && <Text>{hotel.description}</Text>}
      <Stack direction="row" wrap="wrap" gap={2}>
        {hotel.amenities.map((a) => <Badge key={a}>{a}</Badge>)}
      </Stack>

      <RouterLink to={`/hotels/${hotel.id}/edit`}>
        <Button>Edit</Button>
      </RouterLink>
    </Stack>
  );
}
