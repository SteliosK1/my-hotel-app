// src/features/rooms/ui/RoomActions.tsx
import Button from "@mui/material/Button";

type Props = {
  onAddRoom: () => void;
};

export default function RoomActions({ onAddRoom }: Props) {
  return (
    <Button sx={{ variant: "contained", color: "white", backgroundColor: "black" }} onClick={onAddRoom}>
      Add Room
    </Button>
  );
}
