import {
  Box,
  Button,
  Heading,
  HStack,
  Field,
  Input,
  Select,
  Checkbox,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { z } from "zod";
import type { RoomType } from "../domain/types";

// ---------------- Types ----------------
type SubmitValues = {
  roomNumber: string;
  type: "SINGLE" | "DOUBLE" | "SUITE" | "FAMILY";
  pricePerNight: number;
  isAvailable: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => Promise<void> | void;
  initialValues?: Partial<SubmitValues>;
  mode?: "create" | "edit";
  title?: string;
  submitLabel?: string;
};

// ---------------- Schema ----------------
const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["SINGLE", "DOUBLE", "SUITE", "FAMILY"], {
    required_error: "Type is required",
  }),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0"),
  isAvailable: z.coerce.boolean(),
});

// ---------------- Component ----------------
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

  // form state
  const [roomNumber, setRoomNumber] = useState<string>(
    initialValues?.roomNumber ?? ""
  );
  const [type, setType] = useState<RoomType | "">(
    (initialValues?.type as RoomType) ?? ""
  );
  const [pricePerNight, setPricePerNight] = useState<string | number>(
    initialValues?.pricePerNight ?? ""
  );
  const [isAvailable, setIsAvailable] = useState<boolean>(
    initialValues?.isAvailable ?? true
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // v3 Select collection
  const roomTypeCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Single", value: "SINGLE" },
          { label: "Double", value: "DOUBLE" },
          { label: "Suite", value: "SUITE" },
          { label: "Family", value: "FAMILY" },
        ],
      }),
    []
  );

  // hydrate on prop changes
  useEffect(() => {
    if (initialValues) {
      setRoomNumber(initialValues.roomNumber ?? "");
      setType((initialValues.type as RoomType) ?? "");
      setPricePerNight(initialValues.pricePerNight ?? "");
      setIsAvailable(initialValues.isAvailable ?? true);
    } else if (mode === "create") {
      setType("");
      setPricePerNight("");
      setIsAvailable(true);
    }
  }, [initialValues, mode]);

  // submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = roomFormSchema.safeParse({
      roomNumber: String(roomNumber ?? "").trim(),
      type: (type || "") as RoomType,
      pricePerNight: pricePerNight === "" ? NaN : Number(pricePerNight),
      isAvailable: Boolean(isAvailable),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const iss of parsed.error.issues) {
        const key = (iss.path.join(".") || "form") as keyof SubmitValues | "form";
        if (!fieldErrors[key]) fieldErrors[key] = iss.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      setSaving(true);
      await onSubmit(parsed.data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        inset={0}
        bg="blackAlpha.500"
        zIndex={1000}
        onClick={onClose}
      />

      {/* Panel */}
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-form-title"
        style={{
          position: "fixed",
          zIndex: 1001,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          border: "1px solid var(--chakra-colors-gray-200)",
          borderRadius: 12,
          padding: 20,
          width: "90%",
          maxWidth: 520,
          boxShadow: "var(--chakra-shadows-lg)",
        }}
      >
        <Heading id="room-form-title" size="md" style={{ marginBottom: 16 }}>
          {computedTitle}
        </Heading>

        {/* Room Number */}
        <Field.Root invalid={!!errors.roomNumber} required>
          <Field.Label>Room Number</Field.Label>
          <Input
            value={roomNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRoomNumber(e.target.value)
            }
            placeholder="e.g. 101"
          />
          {errors.roomNumber && (
            <Field.ErrorText>{errors.roomNumber}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Type */}
        <Field.Root invalid={!!errors.type} required style={{ marginTop: 12 }}>
          <Field.Label>Type</Field.Label>
          <Select.Root
            collection={roomTypeCollection}
            value={type ? [type] : []}
            onValueChange={({ value }) => {
              const next = (value?.[0] ?? "") as RoomType | "";
              setType(next);
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select type…" />
              </Select.Trigger>
              <Select.Indicator />
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {roomTypeCollection.items.map(
                    (it: { label: string; value: string }) => (
                      <Select.Item item={it} key={it.value}>
                        {it.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    )
                  )}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          {errors.type && <Field.ErrorText>{errors.type}</Field.ErrorText>}
        </Field.Root>

        {/* Price */}
        <Field.Root
          invalid={!!errors.pricePerNight}
          required
          style={{ marginTop: 12 }}
        >
          <Field.Label>Price per Night</Field.Label>
          <Input
            type="number"
            inputMode="decimal"
            value={pricePerNight}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPricePerNight(e.target.value)
            }
            placeholder="e.g. 120"
          />
          {errors.pricePerNight && (
            <Field.ErrorText>{errors.pricePerNight}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Available */}
        <Field.Root style={{ marginTop: 12 }}>
          <Checkbox.Root
            checked={isAvailable}
            onCheckedChange={({ checked }) => setIsAvailable(!!checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Available</Checkbox.Label>
          </Checkbox.Root>
        </Field.Root>

        {/* Actions */}
        <HStack justify="flex-end" mt={6} gap={3}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {/* NOTE: στο δικό σου setup το prop είναι `loading`, όχι `isLoading` */}
          <Button colorScheme="blue" type="submit" loading={saving}>
            {computedSubmit}
          </Button>
        </HStack>
      </form>
    </>
  );
}
