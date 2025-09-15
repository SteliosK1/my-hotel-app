import { Grid, GridItem } from "@chakra-ui/react";
import RoomCard from "../../../components/RoomCard";
import type { Room } from "../../../domain/types";

type Props = {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
};

export default function RoomsGrid({ rooms, onEdit, onDelete }: Props) {
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6} alignItems="stretch">
      {rooms.map((room) => (
        <GridItem key={room.id}>
          <RoomCard room={room} onEdit={onEdit} onDelete={onDelete} />
        </GridItem>
      ))}
    </Grid>
  );
}