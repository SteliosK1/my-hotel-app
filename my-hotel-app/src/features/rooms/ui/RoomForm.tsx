// src/features/rooms/ui/RoomForm.tsx
import { FormContainer } from "react-hook-form-mui";
import { RoomDialog } from "./RoomDialog";
import RoomFormFields from "./RoomFormFields"; // ✅ default import
import { useRoomFormElements } from "../hooks/useRoomForm";
import type { RoomFormValues } from "../schemas/roomFormSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues) => Promise<void> | void;
  initialValues?: Partial<RoomFormValues>;
  mode?: "create" | "edit";
  title?: string;
  submitLabel?: string;
  /** προαιρετικό εξωτερικό loading από mutation */
  isSubmitting?: boolean;
};

export default function RoomForm({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode = "create",
  title,
  submitLabel,
  isSubmitting,
}: Props) {
  const computedTitle = title ?? (mode === "edit" ? "Edit Room" : "Add Room");
  const computedSubmit =
    submitLabel ?? (mode === "edit" ? "Save changes" : "Create room");

  // 🔗 Elements-friendly hook: δίνει resolver/defaultValues/onSuccess
  const { resolver, defaultValues, onSuccess } = useRoomFormElements({
    initialValues,
    onSubmit,
  });

  return (
    <RoomDialog isOpen={isOpen} onClose={onClose} labelledById="room-form-title">
      {/* ΟΛΑ τα Elements πρέπει να είναι μέσα σε FormContainer */}
      <FormContainer
        resolver={resolver}
        defaultValues={defaultValues}
        onSuccess={onSuccess} // καλείται μόνο αν περάσει τη validation
      >
        {/* Δεν χρειάζεται extra <form> εδώ—το FormContainer τυλίγει με form */}
        <RoomFormFields
          title={computedTitle}
          submitLabel={computedSubmit}
          submitting={Boolean(isSubmitting)}
          onCancel={onClose}
        />
      </FormContainer>
    </RoomDialog>
  );
}
