import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import { LoadingButton } from "@mui/lab";
import type { ZodTypeAny } from "zod";
import { AMENITY_OPTIONS } from "../constants/amenities";

type Props<TSchema extends ZodTypeAny> = {
  schema: TSchema;
  onSubmit: (values: any) => Promise<void> | void;
  defaultValues?: any;          // { name, description, amenities?: string[] }
  submitText?: string;
  isSubmitting?: boolean;       // εξωτερικό loading (π.χ. mutation)
};

export default function HotelForm<TSchema extends ZodTypeAny>({
  schema,
  onSubmit,
  defaultValues,
  submitText = "Save",
  isSubmitting: externalSubmitting,
}: Props<TSchema>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      amenities: [],
      ...(defaultValues ?? {}),
    },
  });

  const submitting = externalSubmitting ?? isSubmitting;
  const selectedAmenities: string[] = Array.isArray(defaultValues?.amenities)
    ? defaultValues.amenities
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        {/* Name */}
        <TextField
          label="Name"
          placeholder="Hotel name"
          fullWidth
          {...register("name")}
          error={Boolean(errors?.name)}
          helperText={errors?.name ? String((errors.name as any).message) : ""}
        />

        {/* Description */}
        <TextField
          label="Description"
          placeholder="Short description"
          fullWidth
          multiline
          minRows={3}
          {...register("description")}
          error={Boolean(errors?.description)}
          helperText={
            errors?.description ? String((errors.description as any).message) : ""
          }
        />

        {/* Amenities (checkbox group) — χωρίς Controller */}
        <FormControl
          component="fieldset"
          error={Boolean(errors?.amenities)}
          sx={{ width: "100%" }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Amenities
          </Typography>

          <FormGroup>
            {AMENITY_OPTIONS.map((opt) => (
              <FormControlLabel
                key={opt}
                label={opt}
                control={
                  <Checkbox
                    // ίδιο name για όλα τα checkboxes -> RHF φτιάχνει string[]
                    {...register("amenities")}
                    value={opt}
                    // σωστό checked state όταν κάνεις Edit
                    defaultChecked={selectedAmenities.includes(opt)}
                    size="small"
                  />
                }
              />
            ))}
          </FormGroup>

          {errors?.amenities && (
            <FormHelperText>
              {String((errors.amenities as any)?.message ?? "")}
            </FormHelperText>
          )}
        </FormControl>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={Boolean(submitting)}
          disabled={Boolean(submitting)}
        >
          {submitText}
        </LoadingButton>
      </Stack>
    </form>
  );
}
