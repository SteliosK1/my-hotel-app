import { Box, Heading, HStack, Spinner, Text, Stack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import RoomsFilters from "../components/RoomsFilters";
import RoomsGrid from "../components/RoomsGrid";
import RoomActions from "../components/RoomActions";
import RoomForm from "../../../ui/RoomForm";
import { useRoomsQuery } from "../../../data-access/useRoomQuery/useRoomsQuery";
import { useCreateRoom, useUpdateRoom, useDeleteRoom } from "../../../data-access/mutation/useRoomMutations";
import type { Room, RoomType } from "../../../domain/types";

type Props = { hotelId: string };

export default function RoomsList({ hotelId }: Props) {
  const [type, setType] = useState<RoomType | "">("");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const filters = useMemo(() => {
    const f: Record<string, unknown> = { hotelId };
    if (type) f.type = type;
    return f;
  }, [hotelId, type]);

  const { data: rooms = [], isLoading, error } = useRoomsQuery(filters);

  const visibleRooms = useMemo(() => {
    const base = availableOnly ? rooms.filter((r) => r.isAvailable) : rooms;
    return [...base].sort((a, b) =>
      a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [rooms, availableOnly]);

  const createM = useCreateRoom(hotelId);
  const updateM = useUpdateRoom(hotelId);
  const deleteM = useDeleteRoom(hotelId);

  const onCreate = async (values: { roomNumber: string; type: RoomType; pricePerNight: number | string; isAvailable: boolean }) => {
    try {
      await createM.mutateAsync({
        hotelId,
        roomNumber: String(values.roomNumber).trim(),
        type: values.type,
        pricePerNight: Number(values.pricePerNight),
        isAvailable: Boolean(values.isAvailable),
      });
      setModalOpen(false);
    } catch {}
  };

  const onUpdate = async (id: string, values: { roomNumber: string; type: RoomType; pricePerNight: number | string; isAvailable: boolean }) => {
    try {
      await updateM.mutateAsync({
        id,
        payload: {
          hotelId,
          roomNumber: String(values.roomNumber).trim(),
          type: values.type,
          pricePerNight: Number(values.pricePerNight),
          isAvailable: Boolean(values.isAvailable),
        },
      });
      setEditing(null);
    } catch {}
  };

  const onDelete = async (room: Room) => {
    try {
      await deleteM.mutateAsync(room.id);
    } catch {}
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4} flexWrap="wrap" gap={6} align="center">
        <Heading size="md">Rooms</Heading>
        <HStack gap={6} align="center">
          <RoomsFilters
            type={type}
            availableOnly={availableOnly}
            onTypeChange={setType}
            onAvailableOnlyChange={setAvailableOnly}
          />
          <RoomActions onAddRoom={() => setModalOpen(true)} />
        </HStack>
      </HStack>

      {isLoading && (
        <Stack align="center" py={10}>
          <Spinner borderWidth="4px" />
          <Text>Loading…</Text>
        </Stack>
      )}

      {error && <Text color="red.500">{(error as Error).message}</Text>}

      {!isLoading && !error && (
        <RoomsGrid rooms={visibleRooms} onEdit={setEditing} onDelete={onDelete} />
      )}

      <RoomForm isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={onCreate} />

      {editing && (
        <RoomForm
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          initialValues={{
            roomNumber: editing.roomNumber,
            type: editing.type,
            pricePerNight: editing.pricePerNight,
            isAvailable: editing.isAvailable,
          }}
          onSubmit={(vals) => onUpdate(editing.id, vals)}
          title="Edit Room"
        />
      )}
    </Box>
  );
}
