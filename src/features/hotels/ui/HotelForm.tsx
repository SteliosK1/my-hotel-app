import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Stack, Input, Textarea, Button } from "@chakra-ui/react";
import type { ZodTypeAny } from "zod";

type Props<TSchema extends ZodTypeAny> = {
  defaultValues?: any;
  schema: TSchema;
  onSubmit: (values: any) => Promise<void> | void;
  submitText?: string;
};

export default function HotelForm<TSchema extends ZodTypeAny>({
  defaultValues,
  schema,
  onSubmit,
  submitText = "Save",
}: Props<TSchema>) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3}>
        <Input placeholder="Name" {...register("name")} />
        {errors.name && <span>{String(errors.name.message)}</span>}

        <Textarea placeholder="Description" {...register("description")} />

        <Input placeholder="Amenities (comma separated)" {...register("amenitiesCsv")} />

        <Button type="submit" disabled={isSubmitting}>{submitText}</Button>
      </Stack>
    </form>
  );
}
