import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { Heading, Text, Button, Stack, HStack, Badge } from "@chakra-ui/react";
import { useState } from "react";
import { useHotelQuery } from "../../data-access/useHotelQuery";
import { useDeleteHotelMutation } from "../../data-access/useDeleteMutation";
import DeleteConfirm from "../../components/DeleteConfirm";
import { useToastify } from "@/lib/useToastify";

export default function HotelViewPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { data: hotel, isLoading, isError, refetch } = useHotelQuery(id);
  const del = useDeleteHotelMutation();
  const t = useToastify();
  const [open, setOpen] = useState(false);

  if (isLoading) return <Text>Loading…</Text>;
  if (isError || !hotel) return <Text>Not found</Text>;

  const handleDelete = async () => {
    try {
      await del.mutateAsync(hotel.id);
      t.ok("Hotel deleted", hotel.name);
      nav("/hotels");
    } catch (e: any) {
      t.bad("Delete failed", e.message);
      refetch();
    } finally {
      setOpen(false);
    }
  };

  return (
    <Stack gap={3}>
      <Heading>{hotel.name}</Heading>
      {hotel.description && <Text>{hotel.description}</Text>}
      <Stack direction="row" wrap="wrap" gap={2}>
        {hotel.amenities.map((a) => (
          <Badge key={a}>{a}</Badge>
        ))}
      </Stack>

      <HStack gap={3}>
        <RouterLink to="/hotels">
          <Button>Back to List</Button>
        </RouterLink>
        <RouterLink to={`/hotels/${hotel.id}/edit`}>
          <Button>Edit</Button>
        </RouterLink>
        <Button onClick={() => setOpen(true)} disabled={del.isPending}>
          {del.isPending ? "Deleting…" : "Delete"}
        </Button>
      </HStack>

      <DeleteConfirm
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        name={hotel.name}
      />
    </Stack>
  );
}
