import { useMemo, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Button,
  Select,
  Checkbox,
  Spinner,
  Text,
  Stack,
  Portal,
  createListCollection,
} from "@chakra-ui/react";

import RoomCard from "../../../components/RoomCard";
import RoomForm from "../../../ui/RoomForm";
import { useRoomsQuery } from "../../../data-access/useRoomQuery/useRoomsQuery";
import {
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from "../../../data-access/mutation/useRoomMutations";
import type { Room, RoomType } from "../../../domain/types";

type Props = { hotelId: string };

export default function RoomsList({ hotelId }: Props) {
  // Filters
  const [type, setType] = useState<RoomType | "">("");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Build Select collection for Chakra v3
  const roomTypeCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "All", value: "" },
          { label: "Single", value: "SINGLE" },
          { label: "Double", value: "DOUBLE" },
          { label: "Suite", value: "SUITE" },
          { label: "Family", value: "FAMILY" },
        ],
      }),
    []
  );

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  // Server-side filters (isAvailable φιλτράρεται client-side)
  const filters = useMemo(() => {
    const f: Record<string, unknown> = { hotelId };
    if (type) f.type = type;
    return f;
  }, [hotelId, type]);

  // Fetch
  const {
    data: rooms = [] as Room[],
    isLoading,
    error,
  } = useRoomsQuery(filters);

  // Client-side availability + natural sort by roomNumber
  const visibleRooms = useMemo(() => {
    const base = availableOnly
      ? rooms.filter((r: Room) => r.isAvailable === true)
      : rooms;
    return [...base].sort((a, b) =>
      a.roomNumber.localeCompare(b.roomNumber, undefined, {
        numeric: true,
        sensitivity: "base",
      })
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
      <HStack justify="space-between" mb={4} flexWrap="wrap" gap={6} align="center">
        <Heading size="md">Rooms</Heading>

        <HStack gap={6} align="center">
          {/* Type filter (Chakra v3 Select) */}
          <Select.Root
            collection={roomTypeCollection}
            value={type ? [type] : []}
            onValueChange={({ value }) => {
              const next = (value?.[0] ?? "") as RoomType | "";
              setType(next);
            }}
            size="sm"
            width="220px"
          >
            <Select.HiddenSelect />
            <Select.Label>Type</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="All" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {roomTypeCollection.items.map(
                    (it: { label: string; value: string }) => (
                      <Select.Item item={it} key={it.value}>
                        {it.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    )
                  )}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {/* Available only (client-side) - Chakra v3 Checkbox */}
          <Checkbox.Root
            checked={availableOnly}
            onCheckedChange={({ checked }) => setAvailableOnly(!!checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Available only</Checkbox.Label>
          </Checkbox.Root>

          <Button onClick={() => setModalOpen(true)} colorScheme="blue">
            Add Room
          </Button>
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
        <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6} alignItems="stretch">
          {visibleRooms.map((r: Room) => (
            <GridItem key={r.id}>
              <RoomCard room={r} onEdit={(room) => setEditing(room)} onDelete={onDelete} />
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Create */}
      <RoomForm isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={onCreate} />

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
