import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny, z } from "zod";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";

import {
  FormContainer,
  TextFieldElement,
  CheckboxButtonGroup,
  useFormContext, // για να πάρουμε isSubmitting από το form
} from "react-hook-form-mui";

import { AMENITY_OPTIONS } from "../constants/amenities";

type Props<TSchema extends ZodTypeAny> = {
  schema: TSchema;
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void;
  defaultValues?: Partial<z.infer<TSchema>>; // { name, description, amenities?: string[] }
  submitText?: string;
  isSubmitting?: boolean; // εξωτερικό loading (π.χ. mutation)
};

// Μικρό child component μόνο για το submit button ώστε να πάρουμε το isSubmitting από RHF
function SubmitButton({ label, externalLoading }: { label: string; externalLoading?: boolean }) {
  const { formState: { isSubmitting } } = useFormContext();
  const loading = externalLoading ?? isSubmitting;
  return (
    <LoadingButton type="submit" variant="contained" loading={loading} disabled={loading}>
      {label}
    </LoadingButton>
  );
}

export default function HotelForm<TSchema extends ZodTypeAny>({
  schema,
  onSubmit,
  defaultValues,
  submitText = "Save",
  isSubmitting,
}: Props<TSchema>) {
  return (
    <FormContainer
      resolver={zodResolver(schema)}
      defaultValues={{
        name: "",
        description: "",
        amenities: [],
        ...(defaultValues ?? {}),
      }}
      // onSuccess καλείται μόνο αν περάσει η validation
      onSuccess={async (vals) => {
        // (προαιρετικά) καθάρισε διπλές τιμές στα amenities
        const values = { ...vals, amenities: Array.from(new Set((vals as any).amenities ?? [])) };
        await onSubmit(values as z.infer<TSchema>);
      }}
    >
      <Stack spacing={2.5}>
        <TextFieldElement
          name="name"
          label="Name"
          placeholder="Hotel name"
          fullWidth
          required
        />

        <TextFieldElement
          name="description"
          label="Description"
          placeholder="Short description"
          fullWidth
          multiline
          minRows={3}
          required
        />

        <Stack spacing={1}>
          <Typography variant="subtitle1">Amenities</Typography>
          <CheckboxButtonGroup
            name="amenities"
            options={AMENITY_OPTIONS as unknown as string[]} // δέχεται string[] ή {id,label}
            // (προαιρετικά) μπορείς να περάσεις row / helperText κ.λπ.
          />
        </Stack>

        <SubmitButton label={submitText} externalLoading={isSubmitting} />
      </Stack>
    </FormContainer>
  );
}
