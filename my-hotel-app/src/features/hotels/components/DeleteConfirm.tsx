// src/features/hotels/components/DeleteConfirm.tsx
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};

export default function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  name,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Delete “{name}”
      </DialogTitle>

      <DialogContent>
        <Typography id="delete-dialog-description" variant="body2" color="text.secondary">
          Are you sure? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ ml: "auto", px: 1, py: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
