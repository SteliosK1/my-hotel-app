// src/features/hotels/feature/list/list-hotels/HotelsListPage.tsx
import { Heading, HStack, Button, ButtonGroup, Pagination } from "@chakra-ui/react";
import { useState } from "react";
import HotelsGrid from "../../../ui/HotelsGrid";
import EmptyState from "../../../components/EmptyState";
import { useHotelsPagedQuery } from "../../../data-access/useHotelsPagedQuery";

export default function HotelsListPage() {
  const [page, setPage] = useState(1);
  const perPage = 1 as const; // 👈 1 hotel ανά σελίδα
  const order: "asc" | "desc" = "desc";

  const { data, isLoading } = useHotelsPagedQuery(page, perPage, order);

  if (isLoading) return <Heading size="sm">Loading…</Heading>;
  if (!data || data.items.length === 0) return <EmptyState />;

  const { items, meta } = data;

  return (
    <>
      <HStack justify="space-between" mb={4}>
        <Heading>Hotels</Heading>
      </HStack>

      <HotelsGrid hotels={items} />

      {/* Pagination στο κέντρο */}
      <HStack mt={6} justify="center">
        <Pagination.Root
          count={meta.total}
          pageSize={meta.per_page}
          page={meta.page}
          onPageChange={(e) => setPage(e.page)}
        >
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <Button aria-label="Previous page">‹</Button>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(item) => (
                <Pagination.Item key={item.value} {...item} asChild>
                  <Button
                    aria-label={`Go to page ${item.value}`}
                    variant={meta.page === item.value ? "solid" : "ghost"}
                  >
                    {item.value}
                  </Button>
                </Pagination.Item>
              )}
            />

            <Pagination.NextTrigger asChild>
              <Button aria-label="Next page">›</Button>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </HStack>
    </>
  );
}
