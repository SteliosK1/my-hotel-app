// src/features/hotels/components/AmenityCheckboxGroup.tsx
import { Stack, HStack } from "@chakra-ui/react";
import { AMENITY_OPTIONS, type AmenityOption } from "../constants/amenities";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
};

export default function AmenityCheckboxGroup({ value, onChange }: Props) {
  const toggle = (opt: AmenityOption, checked: boolean) => {
    const set = new Set(value);
    if (checked) set.add(opt);
    else set.delete(opt);
    onChange(Array.from(set));
  };

  return (
    <Stack gap={2}>
      {AMENITY_OPTIONS.map((opt) => {
        const id = `amenity-${opt}`;
        const checked = value.includes(opt);
        return (
          <HStack key={opt} gap={2}>
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={(e) => toggle(opt, e.target.checked)}
            />
            {/* ✅ Χρησιμοποιούμε native <label> για να αποφύγουμε το TS error με htmlFor */}
            <label htmlFor={id}>{opt}</label>
          </HStack>
        );
      })}
    </Stack>
  );
}
