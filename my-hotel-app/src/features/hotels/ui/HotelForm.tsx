import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { ZodTypeAny } from "zod";
import { LoadingButton } from "@mui/lab";
import AmenityCheckboxGroup from "../components/AmenityCheckboxGroup";

type Props<TSchema extends ZodTypeAny> = {
  defaultValues?: any;
  schema: TSchema;
  onSubmit: (values: any) => Promise<void> | void;
  submitText?: string;
  amenitiesAsCheckboxes?: boolean;
  isSubmitting?: boolean;
};

export default function HotelForm<TSchema extends ZodTypeAny>({
  defaultValues,
  schema,
  onSubmit,
  submitText = "Save",
  isSubmitting: externalSubmitting,
}: Props<TSchema>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      ...defaultValues,
    },
  });

  const submitting = externalSubmitting ?? isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <TextField
          label="Name"
          placeholder="Hotel name"
          fullWidth
          {...register("name")}
          error={Boolean(errors.name)}
          helperText={errors.name ? String((errors.name as any).message) : ""}
        />

        <TextField
          label="Description"
          placeholder="Short description"
          fullWidth
          multiline
          minRows={3}
          {...register("description")}
          error={Boolean(errors.description)}
          helperText={errors.description ? String((errors.description as any).message) : ""}
        />
          <Controller
            name="amenities"
            control={control}
            render={({ field: { value = [], onChange } }) => (
              <AmenityCheckboxGroup
                value={value}
                onChange={onChange}
                error={errors.amenities ? String((errors.amenities as any).message) : null}
              />
            )}
          />

        
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
