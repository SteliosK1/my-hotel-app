import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";

import {
  TextFieldElement,
  SelectElement,
  SwitchElement,
} from "react-hook-form-mui";

import { ROOM_TYPES } from "../constants/roomTypes"; // [{ value, label }...]

type Props = {
  title: string;
  submitLabel: string;
  submitting?: boolean;
  onCancel: () => void;
};

const TYPE_OPTIONS = ROOM_TYPES.map((t) => ({
  id: String(t.value),
  label: t.label,
}));

export default function RoomFormFields({
  title,
  submitLabel,
  submitting = false,
  onCancel,
}: Props) {
  return (
    <Stack spacing={2}>
      <DialogTitle id="room-form-title" sx={{ p: 0 }}>
        {title}
      </DialogTitle>

      {/* Room number */}
      <TextFieldElement
        name="roomNumber"
        label="Room number"
        placeholder="e.g. 101"
        fullWidth
        required
      />

      {/* Type */}
      <SelectElement
        name="type"
        label="Type"
        options={TYPE_OPTIONS} // [{id,label}]
        fullWidth
        required
      />

      {/* Price per night */}
      <TextFieldElement
        name="pricePerNight"
        label="Price per night (€)"
        type="number"
        fullWidth
        required
        inputProps={{ min: 0, step: 1 }}
      />

      {/* Availability */}
      <SwitchElement name="isAvailable" label="Available" />

      <DialogActions sx={{ px: 0 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={submitting}
        >
          {submitLabel}
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
}
