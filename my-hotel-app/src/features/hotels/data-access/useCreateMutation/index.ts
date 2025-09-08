// src/features/hotels/data-access/useCreateMutation/index.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient";
import type { Hotel } from "../../domain/hotel";

async function createHotel(input: Omit<Hotel, "id">) {
  const { data } = await httpClient.post<Hotel>("/hotels", input);
  return data;
}

export const useCreateHotelMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createHotel,
    onSuccess: (created) => {
      // ✅ ενημέρωσε cache λίστας
      qc.setQueryData<Hotel[]>(["hotels"], (prev) =>
        prev ? [created, ...prev] : [created]
      );
      qc.setQueryData(["hotel", created.id], created);
    },
    onSettled: () => {
      // ensure fresh
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
