import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        spacing={3}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">Rooms</Typography>

        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <RoomsFilters
            type={type}
            availableOnly={availableOnly}
            onTypeChange={setType}
            onAvailableOnlyChange={setAvailableOnly}
          />
          <RoomActions onAddRoom={() => setModalOpen(true)} />
        </Stack>
      </Stack>

      {isLoading && (
        <Stack alignItems="center" py={10} spacing={1.5}>
          <CircularProgress thickness={4} />
          <Typography variant="body2">Loading…</Typography>
        </Stack>
      )}

      {error && (
        <Typography variant="body2" sx={{ color: "error.main" }}>
          {(error as Error).message}
        </Typography>
      )}

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
