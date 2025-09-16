import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { RoomDialog } from "./RoomDialog";
import { RoomFormFields } from "./RoomFormFields";
import { useRoomForm } from "../hooks/useRoomForm";
import type { RoomFormValues } from "../schemas/roomFormSchema";
import { ROOM_TYPES } from "../constants/roomTypes"; // [{ value: "SINGLE", label: "Single" }, ...]

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues) => Promise<void> | void;
  initialValues?: Partial<RoomFormValues>;
  mode?: "create" | "edit";
  title?: string;
  submitLabel?: string;
};

// φέρνει ό,τι κι αν έρθει (label/value/undefined) σε έγκυρο value του ROOM_TYPES
const normalizeType = (val: unknown): "SINGLE" | "DOUBLE" | "SUITE" | "FAMILY" | undefined => {
  const allowed = ROOM_TYPES.map((t) => t.value);
  if (typeof val !== "string") return undefined;
  const byLabel = ROOM_TYPES.find((t) => t.label === val);
  if (byLabel) return byLabel.value as "SINGLE" | "DOUBLE" | "SUITE" | "FAMILY";
  return allowed.includes(val as any) ? (val as "SINGLE" | "DOUBLE" | "SUITE" | "FAMILY") : undefined;
};

export default function RoomForm({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode = "create",
  title,
  submitLabel,
}: Props) {
  const computedTitle = title ?? (mode === "edit" ? "Edit Room" : "Add Room");
  const computedSubmit =
    submitLabel ?? (mode === "edit" ? "Save changes" : "Create room");

  const [saving, setSaving] = useState(false);

  const { form, handleSubmit } = useRoomForm({
    initialValues,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        await onSubmit(values);
        onClose();
      } finally {
        setSaving(false);
      }
    },
  });

  // Όταν αλλάζει το room που κάνουμε edit, κάνε reset τα default values
  useEffect(() => {
    form.reset({
      roomNumber: initialValues?.roomNumber ?? "",
      type: normalizeType(initialValues?.type),
      pricePerNight:
        (initialValues?.pricePerNight as any) ?? "", // αφήνουμε empty string για το TextField
      isAvailable: Boolean(initialValues?.isAvailable),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <RoomDialog isOpen={isOpen} onClose={onClose} labelledById="room-form-title">
      <form onSubmit={onFormSubmit} noValidate>
        <RoomFormFields
          form={form}
          title={computedTitle}
          submitLabel={computedSubmit}
          onCancel={onClose}
          submitting={saving}
        />
      </form>
    </RoomDialog>
  );
}
