import { useState } from "react";
import type { FormEvent } from "react";
import { RoomDialog } from "./RoomDialog";
import { RoomFormFields } from "./RoomFormFields";
import { useRoomForm } from "../hooks/useRoomForm";
import type { RoomFormValues } from "../schemas/roomFormSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues) => Promise<void> | void;
  initialValues?: Partial<RoomFormValues>;
  mode?: "create" | "edit";
  title?: string;
  submitLabel?: string;
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
