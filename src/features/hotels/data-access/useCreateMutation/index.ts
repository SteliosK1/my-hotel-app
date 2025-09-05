// src/features/hotels/data-access/useCreateMutation/index.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHotel } from "../gateway/hotelGateway";

export const useCreateHotelMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createHotel,
    onSuccess: (created) => {
      // πρόσθεσέ το στη λίστα άμεσα (χωρίς έξτρα fetch)
      qc.setQueryData(["hotels"], (prev: any) =>
        Array.isArray(prev) ? [created, ...prev] : [created]
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
