// src/features/hotels/feature/view/HotelViewPage.tsx
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import { useHotelQuery } from "../../data-access/useHotelQuery";
import { useDeleteHotelMutation } from "../../data-access/useDeleteMutation";
import DeleteConfirm from "../../components/DeleteConfirm";
import { useToastify } from "@/lib/useToastify";
import RoomsList from "@/features/rooms/feature/list/list-rooms/RoomsList"; // έλεγξε ότι αυτό το path υπάρχει

export default function HotelViewPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { data: hotel, isLoading, isError, refetch } = useHotelQuery(id);
  const del = useDeleteHotelMutation();
  const t = useToastify();
  const [open, setOpen] = useState(false);
  const hotelId = id;

  if (isLoading) return <Typography>Loading…</Typography>;
  if (isError || !hotel) return <Typography>Not found</Typography>;

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
    <Stack spacing={3}>
      <Typography variant="h5">{hotel.name}</Typography>

      {hotel.description && (
        <Typography variant="body2" color="text.secondary">
          {hotel.description}
        </Typography>
      )}

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {hotel.amenities?.map((a: string) => (
          <Chip key={a} label={a} size="small" />
        ))}
      </Stack>

      <Stack direction="row" spacing={1.5}>
        {/* palette.primary (outlined) */}
        <Button component={RouterLink} to="/hotels" variant="outlined" sx={{ color: "black", borderColor: "black" }}>
          Back to List
        </Button>

        {/* Custom gray color for Edit button */}
        <Button
          component={RouterLink}
          to={`/hotels/${hotel.id}/edit`}
          variant="contained"
          sx={{ backgroundColor: "gray", color: "white", "&:hover": { backgroundColor: "darkgray" } }}
        >
          Edit
        </Button>

        {/* Custom black color for Delete button */}
        <Button
          onClick={() => setOpen(true)}
          disabled={del.isPending}
          variant="contained"
          sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#1f1e1e" } }}
        >
          {del.isPending ? "Deleting…" : "Delete"}
        </Button>
      </Stack>

      <DeleteConfirm
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        name={hotel.name}
      />

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Hotel details
        </Typography>
        {hotelId && <RoomsList hotelId={hotelId} />}
      </Box>
    </Stack>
  );
}
