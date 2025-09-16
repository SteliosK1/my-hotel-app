import type { PropsWithChildren } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";

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
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby={labelledById}
      // ίδιο περίπου sizing με το παλιό panel
      fullWidth
      maxWidth="sm"
      PaperProps={{
        // style κοντά στο Chakra: radius, padding, border
        sx: {
          borderRadius: 2, // ~12px
          p: 3,            // ~24px
          border: "1px solid",
          borderColor: "divider",
        },
      }}
      // backdrop click => onClose (default MUI behavior)
    >
      {/* Το περιεχόμενο του dialog */}
      <Box component="section" role="document">
        {children}
      </Box>
    </Dialog>
  );
}
