import { Heading } from "@chakra-ui/react";
import { useHotelsQuery } from "../../../data-access/useHotelsQuery";
import HotelsGrid from "../../../ui/HotelsGrid";
import EmptyState from "../../../components/EmptyState";

export default function HotelsListPage() {
  const { data, isLoading } = useHotelsQuery();
  if (isLoading) return <Heading size="sm">Loading…</Heading>;
  if (!data || data.length === 0) return <EmptyState />;
  return (
    <>
      <Heading mb={4}>Hotels</Heading>
      <HotelsGrid hotels={data} />
    </>
  );
}
