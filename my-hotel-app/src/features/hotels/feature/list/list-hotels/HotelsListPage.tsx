// src/features/hotels/feature/list/list-hotels/HotelsListPage.tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

import HotelsGrid from "../../../ui/HotelsGrid";
import EmptyState from "../../../components/EmptyState";
import { useHotelsPagedQuery } from "../../../data-access/useHotelsPagedQuery";

export default function HotelsListPage() {
  const [page, setPage] = useState(1);
  const perPage = 3 as const; // 👈 1 hotel ανά σελίδα (ίδιο με πριν)
  const order: "asc" | "desc" = "desc";

  const { data, isLoading } = useHotelsPagedQuery(page, perPage, order);

  if (isLoading) return <Typography variant="subtitle2">Loading…</Typography>;
  if (!data || data.items.length === 0) return <EmptyState />;

  const { items, meta } = data;

  // Το MUI Pagination θέλει αριθμό σελίδων, όχι total items
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.per_page));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Hotels</Typography>
      </Stack>

      <HotelsGrid hotels={items} />

      {/* Pagination στο κέντρο */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
      <Pagination
  count={totalPages}
  page={meta.page}
  onChange={(_, value) => setPage(value)}
  shape="rounded"
  siblingCount={1}
  boundaryCount={1}
  sx={{
    "& .MuiPaginationItem-root": {
      color: "common.black",                // χρώμα αριθμών/βελών
    },
    "& .MuiPaginationItem-root.Mui-selected": {
      bgcolor: "common.black",              // selected background
      color: "common.white",
      "&:hover": { bgcolor: "grey.900" },
    },
    "& .MuiPaginationItem-ellipsis": {
      color: "common.black",
    },
  }}
/>

      </Stack>
    </Box>
  );
}
