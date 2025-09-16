import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import RoomCard from "../../../components/RoomCard";
import type { Room } from "../../../domain/types";

type Props = {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
};

export default function RoomsGrid({ rooms, onEdit, onDelete }: Props) {
  return (
    <Box sx={{ width: "100%" }}>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        spacing={3}
        defaultColumns={1}   // βοηθά στο SSR/hydration
        defaultHeight={450}
        defaultSpacing={2}
      >
        {rooms.map((room, i) => (
          <Box key={room.id ?? i} sx={{ width: "100%" }}>
            <RoomCard room={room} onEdit={onEdit} onDelete={onDelete} />
          </Box>
        ))}
      </Masonry>
    </Box>
  );
}
