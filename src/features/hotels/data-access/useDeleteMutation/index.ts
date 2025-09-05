// src/features/hotels/data-access/useDeleteMutation/index.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient";
import type { Hotel } from "../../domain/hotel";

async function deleteHotel(id: string) {
  await httpClient.delete(`/hotels/${id}`);
  return id;
}

export const useDeleteHotelMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteHotel,

    // Optimistic update: βγάζουμε προσωρινά το item από τη λίστα
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["hotels"] });
      const prev = qc.getQueryData<Hotel[]>(["hotels"]);

      qc.setQueryData<Hotel[]>(["hotels"], (old) =>
        (old ?? []).filter((h) => h.id !== id)
      );

      return { prev };
    },

    // Αν αποτύχει, κάνε rollback
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["hotels"], ctx.prev);
    },

    // Καθάρισε το detail από την cache
    onSuccess: (id) => {
      qc.removeQueries({ queryKey: ["hotel", id] });
    },

    // Φρεσκάρισε τη λίστα
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
