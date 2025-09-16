// src/features/rooms/ui/RoomsFilters.tsx
import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import type { RoomType } from "../../../domain/types";

type Props = {
  type: RoomType | "";
  availableOnly: boolean;
  onTypeChange: (type: RoomType | "") => void;
  onAvailableOnlyChange: (available: boolean) => void;
};

export default function RoomsFilters({
  type,
  availableOnly,
  onTypeChange,
  onAvailableOnlyChange,
}: Props) {
  const items = useMemo(
    () => [
      { label: "All", value: "" as RoomType | "" },
      { label: "Single", value: "SINGLE" as RoomType },
      { label: "Double", value: "DOUBLE" as RoomType },
      { label: "Suite", value: "SUITE" as RoomType },
      { label: "Family", value: "FAMILY" as RoomType },
    ],
    []
  );

  return (
    <Stack direction="row" spacing={3} alignItems="center">
      {/* Type filter */}
      <Box sx={{ width: 220 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="room-type-label">Type</InputLabel>
          <Select
            labelId="room-type-label"
            id="room-type-select"
            label="Type"
            value={type}
            onChange={(e) => onTypeChange((e.target.value as RoomType) || "")}
          >
            {items.map((it) => (
              <MenuItem key={it.label} value={it.value}>
                {it.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Available only */}
      <FormControlLabel
        control={
          <Checkbox
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            size="small"
          />
        }
        label="Available only"
      />
    </Stack>
  );
}
