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

    // optimistic update
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["hotels"] });

      const prev = qc.getQueryData<Hotel[]>(["hotels"]);
      if (prev) {
        qc.setQueryData<Hotel[]>(
          ["hotels"],
          prev.filter((h) => h.id !== id)
        );
      }
      return { prev };
    },

    onError: (_err, _id, ctx) => {
      // rollback
      if (ctx?.prev) qc.setQueryData(["hotels"], ctx.prev);
    },

    onSuccess: (id) => {
      qc.removeQueries({ queryKey: ["hotel", id] });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
