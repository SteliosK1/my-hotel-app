// src/features/rooms/ui/RoomFormFields.tsx
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";// (δεν το χρησιμοποιούμε στο native mode, μπορείς να το αφαιρέσεις)
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import Typography from "@mui/material/Typography";
import type { UseFormReturn } from "react-hook-form";
import type { RoomFormValues } from "../schemas/roomFormSchema";
import { ROOM_TYPES } from "../constants/roomTypes"; // [{ value, label }...]

type Props = {
  form: UseFormReturn<RoomFormValues>;
  title: string;
  submitLabel: string;
  submitting?: boolean;
  onCancel: () => void;
};

export function RoomFormFields({
  form,
  title,
  submitLabel,
  submitting = false,
  onCancel,
}: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Stack spacing={2}>
      <DialogTitle id="room-form-title" sx={{ p: 0 }}>
        {title}
      </DialogTitle>

      {/* Room number */}
      <TextField
        label="Room number"
        placeholder="e.g. 101"
        fullWidth
        {...register("roomNumber")}
        error={!!errors.roomNumber}
        helperText={errors.roomNumber ? String(errors.roomNumber.message) : ""}
      />

      {/* Type (MUI Select σε native mode ώστε να παίζει με register, ΧΩΡΙΣ Controller) */}
      <FormControl fullWidth error={!!errors.type}>
        <InputLabel htmlFor="room-type-native">Type</InputLabel>
        <Select
          native
          label="Type"
          inputProps={{
            id: "room-type-native",
            // το register πάει στο πραγματικό <select> input
            ...register("type"),
          }}
        >
          {/* προαιρετικό placeholder αν θες “κενό” */}
          {/* <option value="" disabled>Select type…</option> */}
          {ROOM_TYPES.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </Select>
        {errors.type && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            {String(errors.type.message)}
          </Typography>
        )}
      </FormControl>

      {/* Price per night */}
      <TextField
        label="Price per night (€)"
        placeholder="e.g. 120"
        fullWidth
        type="number"
        inputProps={{ min: 0, step: 1 }}
        {...register("pricePerNight")}
        error={!!errors.pricePerNight}
        helperText={errors.pricePerNight ? String(errors.pricePerNight.message) : ""}
      />

      {/* Availability (Switch) — ΧΩΡΙΣ Controller, απευθείας register */}
      <FormControlLabel
        control={
          <Switch
            // RHF θα χειριστεί το checkbox ως boolean με βάση το checked
            {...register("isAvailable")}
          />
        }
        label="Available"
      />

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
