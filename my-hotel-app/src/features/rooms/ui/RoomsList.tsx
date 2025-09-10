import { useMemo, useState } from "react";
import { Box, Grid, GridItem, Heading, HStack, Button } from "@chakra-ui/react";
import RoomCard from "./RoomCard";
import RoomForm from "./RoomForm";
import { useRoomsQuery } from "../data/useRoomsQuery";
import { useCreateRoom, useUpdateRoom, useDeleteRoom } from "../data/useRoomMutations";
import type { Room, RoomType } from "../domain/types";

type Props = { hotelId: string };

export default function RoomsList({ hotelId }: Props) {
  // Filters
  const [type, setType] = useState<RoomType | "">("");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  // Server-side filters: ΜΗΝ στέλνεις isAvailable -> θα φιλτράρουμε client-side
  const filters = useMemo(() => {
    const f: any = { hotelId };
    if (type) f.type = type;
    return f;
  }, [hotelId, type]);

  // Fetch
  const { data: rooms = [], isLoading, error } = useRoomsQuery(filters);

// Client-side availability + sorting by roomNumber (ascending, natural)
const visibleRooms = useMemo(() => {
  const base = availableOnly ? rooms.filter((r) => r.isAvailable === true) : rooms;
  return [...base].sort((a, b) =>
    a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: "base" })
  );
}, [rooms, availableOnly]);


  // Mutations
  const createM = useCreateRoom(hotelId);
  const updateM = useUpdateRoom(hotelId);
  const deleteM = useDeleteRoom(hotelId);

  // Handlers
  const onCreate = async (values: {
    roomNumber: string;
    type: RoomType;
    pricePerNight: number | string;
    isAvailable: boolean;
  }) => {
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

  const onUpdate = async (
    id: string,
    values: {
      roomNumber: string;
      type: RoomType;
      pricePerNight: number | string;
      isAvailable: boolean;
    }
  ) => {
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

  // UI
  return (
    <Box>
      <HStack justify="space-between" mb={4} flexWrap="wrap" gap={12} align="center">
        <Heading size="md">Rooms</Heading>

        <HStack gap={12} align="center">
          {/* Type filter */}
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ marginRight: 8 }}>Type</span>
            <select
              value={type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setType((e.target.value as RoomType) || "")
              }
              style={{ padding: "6px 8px", borderRadius: 6 }}
            >
              <option value="">All</option>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="SUITE">Suite</option>
              <option value="FAMILY">Family</option>
            </select>
          </label>

          {/* Available only (client-side) */}
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAvailableOnly(e.target.checked)
              }
            />
            <span>Available only</span>
          </label>

          <Button onClick={() => setModalOpen(true)}>Add Room</Button>
        </HStack>
      </HStack>

      {isLoading && <Box>Loading…</Box>}
      {error && <Box color="red.500">{(error as Error).message}</Box>}

      {!isLoading && !error && (
        <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6} alignItems="stretch">
          {visibleRooms.map((r) => (
            <GridItem key={r.id}>
              <RoomCard room={r} onEdit={(room) => setEditing(room)} onDelete={onDelete} />
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Create */}
      <RoomForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onCreate}
      />

      {/* Edit */}
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
