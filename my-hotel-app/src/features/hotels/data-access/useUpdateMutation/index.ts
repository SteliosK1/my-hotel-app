// src/features/hotels/data-access/useUpdateMutation/index.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient";
import type { Hotel } from "../../domain/hotel";

async function updateHotel(id: string, input: Partial<Omit<Hotel, "id">>) {
  const { data } = await httpClient.put<{ data: Hotel }>(`/hotels/${id}`, input);
  return data.data; 
}

export const useUpdateHotelMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Omit<Hotel, "id">> }) =>
      updateHotel(id, input),
    onSuccess: (updated) => {
      // ✅ γράψε το detail
      qc.setQueryData<Hotel>(["hotel", updated.id], updated);
      // ✅ ενημέρωσε και τη λίστα
      qc.setQueryData<Hotel[]>(["hotels"], (prev) =>
        (prev ?? []).map((h) => (h.id === updated.id ? updated : h))
      );
    },
    onSettled: (updated) => {
      if (updated?.id) qc.invalidateQueries({ queryKey: ["hotel", updated.id] });
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
