import { Button } from "@chakra-ui/react";

type Props = {
  onAddRoom: () => void;
};

export default function RoomActions({ onAddRoom }: Props) {
  return (
    <Button onClick={onAddRoom} colorScheme="blue">
      Add Room
    </Button>
  );
}