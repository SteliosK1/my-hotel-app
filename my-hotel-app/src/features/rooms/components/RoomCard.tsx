// src/features/rooms/ui/RoomCard.tsx
import { useState } from "react";
import type { Room } from "../domain/types";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

type Props = {
  room: Room;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
};

export default function RoomCard({ room, onEdit, onDelete }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete?.(room);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 150ms",
          "&:hover": { boxShadow: 4 },
        }}
      >
        {/* Header */}
        <CardContent sx={{ pb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 28, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={`#${room.roomNumber} — ${room.type}`}
            >
              #{room.roomNumber} — {room.type}
            </Typography>

            <Chip
              size="small"
              label={room.isAvailable ? "Available" : "Unavailable"}
              color={room.isAvailable ? "success" : "error"}
              variant="outlined"
              sx={{ flexShrink: 0 }}
            />

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {onEdit && (
                <Button size="small" variant="contained" color="inherit" onClick={() => onEdit(room)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ color: "white", backgroundColor: "black" }}
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>

        {/* Body */}
        <CardContent sx={{ pt: 0, flex: "1 1 auto", minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            €{room.pricePerNight} / night
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={room.hotel?.name ?? String(room.hotelId)}
          >
            {room.hotel?.name ?? room.hotelId}
          </Typography>
        </CardContent>

        {/* Footer (reserved for spacing/actions if χρειαστεί) */}
        <CardActions sx={{ mt: "auto", pt: 0.5, pb: 1.5 }} />
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete room <b>{room.roomNumber}</b>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
