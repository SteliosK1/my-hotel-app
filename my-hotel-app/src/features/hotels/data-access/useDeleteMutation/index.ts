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
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["hotels"] });
      const prev = qc.getQueryData<Hotel[]>(["hotels"]);
      qc.setQueryData<Hotel[]>(["hotels"], (old) => (old ?? []).filter((h) => h.id !== id));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["hotels"], ctx.prev); // rollback
    },
    onSuccess: (id) => {
      qc.removeQueries({ queryKey: ["hotel", id] });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
