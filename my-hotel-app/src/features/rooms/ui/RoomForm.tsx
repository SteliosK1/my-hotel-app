// src/features/rooms/ui/RoomForm.tsx
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import { z } from "zod";
import type { RoomType } from "../domain/types";

type SubmitValues = {
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => Promise<void> | void;
  initialValues?: Partial<SubmitValues>;
  /** "create" (default) ή "edit" */
  mode?: "create" | "edit";
  /** override τίτλου αν θες */
  title?: string;
  /** override κειμένου κουμπιού αν θες */
  submitLabel?: string;
};

// Zod schema (coerce number για να δέχεται string από input)
const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["SINGLE", "DOUBLE", "SUITE", "FAMILY"], {
    required_error: "Type is required",
  }),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0"),
  isAvailable: z.coerce.boolean(),
});

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
  const computedSubmit = submitLabel ?? (mode === "edit" ? "Save changes" : "Create room");

  const [roomNumber, setRoomNumber] = useState(initialValues?.roomNumber ?? "");
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

  useEffect(() => {
    if (initialValues) {
      setRoomNumber(initialValues.roomNumber ?? "");
      setType((initialValues.type as RoomType) ?? "");
      setPricePerNight(initialValues.pricePerNight ?? "");
      setIsAvailable(initialValues.isAvailable ?? true);
    } else if (mode === "create") {
      // προαιρετικά defaults για create
      setType("");
      setPricePerNight("");
      setIsAvailable(true);
    }
  }, [initialValues, mode]);

  const valuesForValidation = useMemo(
    () => ({
      roomNumber: String(roomNumber ?? "").trim(),
      type: (type || "") as RoomType,
      pricePerNight: pricePerNight === "" ? NaN : Number(pricePerNight),
      isAvailable: Boolean(isAvailable),
    }),
    [roomNumber, type, pricePerNight, isAvailable]
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const parsed = roomFormSchema.safeParse(valuesForValidation);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const iss of parsed.error.issues) {
        const key = iss.path.join(".") || "form";
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
      <Box
        as="form"
        onSubmit={handleSubmit}
        position="fixed"
        zIndex={1001}
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderWidth="1px"
        rounded="lg"
        p={5}
        w="90%"
        maxW="520px"
        shadow="lg"
      >
        <Heading size="md" mb={4}>
          {computedTitle}
        </Heading>

        {/* Room Number */}
        <Box mb={3}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Room Number
          </label>
          <input
            value={roomNumber}
            placeholder="e.g. 101"
            onChange={(e) => setRoomNumber(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid var(--chakra-colors-gray-300)",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />
          {errors.roomNumber && (
            <Text mt={1} color="red.500" fontSize="sm">
              {errors.roomNumber}
            </Text>
          )}
        </Box>

        {/* Type */}
        <Box mb={3}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType((e.target.value as RoomType) || "")}
            style={{
              width: "100%",
              border: "1px solid var(--chakra-colors-gray-300)",
              borderRadius: 8,
              padding: "8px 10px",
              background: "white",
            }}
          >
            <option value="">Select type…</option>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="SUITE">Suite</option>
            <option value="FAMILY">Family</option>
          </select>
          {errors.type && (
            <Text mt={1} color="red.500" fontSize="sm">
              {errors.type}
            </Text>
          )}
        </Box>

        {/* Price */}
        <Box mb={3}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Price per Night
          </label>
          <input
            type="number"
            value={pricePerNight}
            placeholder="e.g. 120"
            onChange={(e) => setPricePerNight(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid var(--chakra-colors-gray-300)",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />
          {errors.pricePerNight && (
            <Text mt={1} color="red.500" fontSize="sm">
              {errors.pricePerNight}
            </Text>
          )}
        </Box>

        {/* Available */}
        <Box mb={3}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            <span>Available</span>
          </label>
        </Box>

        {/* Actions */}
        <HStack justify="flex-end" mt={6} gap={3}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit" loading={saving}>
            {computedSubmit}
          </Button>
        </HStack>
      </Box>
    </>
  );
}
