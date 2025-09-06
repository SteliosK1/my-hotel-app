import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Stack, Input, Textarea, Button, Text } from "@chakra-ui/react";
import type { ZodTypeAny } from "zod";
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
  amenitiesAsCheckboxes = false,
  isSubmitting: externalSubmitting,
}: Props<TSchema>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      ...(amenitiesAsCheckboxes ? { amenities: [] } : { amenitiesCsv: "" }),
      ...defaultValues,
    },
  });

  const submitting = externalSubmitting ?? isSubmitting;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3}>
        <Input placeholder="Name" {...register("name")} />
        {errors.name && <Text color="red.500" fontSize="sm">{String(errors.name.message)}</Text>}

        <Textarea placeholder="Description" {...register("description")} />
        {errors.description && <Text color="red.500" fontSize="sm">{String(errors.description.message)}</Text>}

        {amenitiesAsCheckboxes ? (
          <>
            <Controller
              name="amenities"
              control={control}
              render={({ field }) => (
                <AmenityCheckboxGroup value={field.value ?? []} onChange={field.onChange} />
              )}
            />
            {errors.amenities && (
              <Text color="red.500" fontSize="sm">
                {String((errors.amenities as any).message)}
              </Text>
            )}
          </>
        ) : (
          <>
            <Input placeholder="Amenities (comma separated)" {...register("amenitiesCsv")} />
            {errors.amenitiesCsv && (
              <Text color="red.500" fontSize="sm">{String((errors.amenitiesCsv as any).message)}</Text>
            )}
          </>
        )}

        <Button type="submit" loading={submitting} disabled={submitting}>
          {submitting ? "Saving…" : submitText}
        </Button>
      </Stack>
    </form>
  );
}
