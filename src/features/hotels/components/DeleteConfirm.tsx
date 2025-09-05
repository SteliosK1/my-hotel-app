// src/features/hotels/components/DeleteConfirm.tsx
import { Dialog, Button, Stack } from "@chakra-ui/react";

export default function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e: { open: boolean }) => {
        if (!e.open) onClose();
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md">
          <Dialog.Header>Delete “{name}”;</Dialog.Header>
          <Dialog.Description>
            Are you sure? This action cannot be undone.
          </Dialog.Description>
          <Dialog.Footer>
            <Stack direction="row" gap={3}>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={onConfirm}>
                Delete
              </Button>
            </Stack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
