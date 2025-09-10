// src/features/rooms/ui/RoomCard.tsx
import {
  Box,
  Flex,
  Heading,
  Badge,
  Text,
  HStack,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Room } from "../domain/types";

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
    <Box borderWidth="1px" rounded="lg" p={4} position="relative">
      <Flex align="center" gap={3}>
        <Heading size="sm">
          #{room.roomNumber} — {room.type}
        </Heading>
        <Badge colorPalette={room.isAvailable ? "green" : "red"}>
          {room.isAvailable ? "Available" : "Unavailable"}
        </Badge>
        <Spacer />
        <HStack>
          {onEdit && (
            <Button size="sm" onClick={() => onEdit(room)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          )}
        </HStack>
      </Flex>

      <Text mt={2} fontWeight="medium">
        €{room.pricePerNight} / night
      </Text>
      <Text mt={1} color="gray.500">
        {room.hotel?.name ?? room.hotelId}
      </Text>

      {/* Lightweight confirm overlay (χωρίς AlertDialog/Dialog) */}
      {confirmOpen && (
        <>
          {/* Backdrop */}
          <Box
            position="fixed"
            inset={0}
            bg="blackAlpha.500"
            zIndex={1000}
            onClick={() => setConfirmOpen(false)}
          />
          {/* Panel */}
          <Box
            position="fixed"
            zIndex={1001}
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderWidth="1px"
            rounded="lg"
            p={5}
            w="90%"
            maxW="420px"
            shadow="lg"
          >
            <Heading size="md" mb={2}>
              Delete Room
            </Heading>
            <Text mb={4}>
              Are you sure you want to delete room <b>{room.roomNumber}</b>? This
              action cannot be undone.
            </Text>

            <HStack justify="flex-end" gap={3}>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} variant="outline">
                Delete
              </Button>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
}
