import { HStack, Select, Checkbox, Portal } from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";
import { useMemo } from "react";
import type { RoomType } from "../../../domain/types";

type Props = {
  type: RoomType | "";
  availableOnly: boolean;
  onTypeChange: (type: RoomType | "") => void;
  onAvailableOnlyChange: (available: boolean) => void;
};

export default function RoomsFilters({
  type,
  availableOnly,
  onTypeChange,
  onAvailableOnlyChange,
}: Props) {
  const roomTypeCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "All", value: "" },
          { label: "Single", value: "SINGLE" },
          { label: "Double", value: "DOUBLE" },
          { label: "Suite", value: "SUITE" },
          { label: "Family", value: "FAMILY" },
        ],
      }),
    []
  );

  return (
    <HStack gap={6} align="center">
      {/* Type filter */}
      <Select.Root
        collection={roomTypeCollection}
        value={type ? [type] : []}
        onValueChange={({ value }) => {
          const next = (value?.[0] ?? "") as RoomType | "";
          onTypeChange(next);
        }}
        size="sm"
        width="220px"
      >
        <Select.HiddenSelect />
        <Select.Label>Type</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="All" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
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

      {/* Available only */}
      <Checkbox.Root
        checked={availableOnly}
        onCheckedChange={({ checked }) => onAvailableOnlyChange(!!checked)}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Available only</Checkbox.Label>
      </Checkbox.Root>
    </HStack>
  );
}