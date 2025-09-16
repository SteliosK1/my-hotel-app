import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel, FormHelperText } from "@mui/material";
import { AMENITY_OPTIONS, type AmenityOption } from "../constants/amenities";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  disabled?: boolean;
  error?: string | null;
};

export default function AmenityCheckboxGroup({
  value = [],
  onChange,
  label = "Amenities",
  disabled = false,
  error = null,
}: Props) {
  const toggle = (opt: AmenityOption, checked: boolean) => {
    const set = new Set(value);
    if (checked) set.add(opt);
    else set.delete(opt);
    onChange(Array.from(set));
  };

  return (
    <FormControl component="fieldset" error={Boolean(error)} disabled={disabled} sx={{ width: "100%" }}>
      <FormLabel component="legend" sx={{ mb: 1 }}>
        {label}
      </FormLabel>
      <FormGroup>
        {AMENITY_OPTIONS.map((opt) => {
          const checked = value?.includes(opt);
          return (
            <FormControlLabel
              key={opt}
              label={opt}
              control={
                <Checkbox
                  size="small"
                  checked={Boolean(checked)}
                  onChange={(e) => toggle(opt, e.target.checked)}
                />
              }
            />
          );
        })}
      </FormGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
