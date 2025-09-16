import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import Typography from "@mui/material/Typography";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { RoomFormValues } from "../schemas/roomFormSchema";
import { ROOM_TYPES } from "../constants/roomTypes"; // [{ value, label }...]

type Props = {
  form: UseFormReturn<RoomFormValues>;
  title: string;
  submitLabel: string;
  submitting?: boolean;
  onCancel: () => void;
};

const normalizeType = (val: unknown) => {
  const allowed = ROOM_TYPES.map((t) => String(t.value));
  if (typeof val !== "string") return "";
  const byLabel = ROOM_TYPES.find((t) => t.label === val);
  if (byLabel) return String(byLabel.value);
  return allowed.includes(val) ? val : "";
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
    control,
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
        error={Boolean(errors.roomNumber)}
        helperText={errors.roomNumber ? String(errors.roomNumber.message) : ""}
      />

      {/* Type (Select, fully controlled) */}
      <FormControl fullWidth error={!!errors.type}>
        <InputLabel id="room-type-label">Type</InputLabel>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              labelId="room-type-label"
              id="room-type-select"
              label="Type"
              // ✅ ποτέ undefined -> κρατάμε controlled Select
              value={normalizeType(field.value)}
              onChange={(e) => field.onChange(normalizeType(e.target.value))}
            >
              {ROOM_TYPES.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
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
        error={Boolean(errors.pricePerNight)}
        helperText={
          errors.pricePerNight ? String(errors.pricePerNight.message) : ""
        }
      />

      {/* Availability */}
      <FormControlLabel
        control={
          <Controller
            name="isAvailable"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
              />
            )}
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
