import type { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";

type RoomDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  labelledById: string;
};

export function RoomDialog({
  isOpen,
  onClose,
  labelledById,
  children,
}: PropsWithChildren<RoomDialogProps>) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box position="fixed" inset={0} bg="blackAlpha.500" zIndex={1200} onClick={onClose} />
      {/* Panel */}
      <Box
        as="section"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        position="fixed"
        zIndex={1300}
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        border="1px solid var(--chakra-colors-gray-200)"
        borderRadius={12}
        p={5}
        w="90%"
        maxW={520}
        boxShadow="var(--chakra-shadows-lg)"
      >
        {children}
      </Box>
    </>
  );
}
