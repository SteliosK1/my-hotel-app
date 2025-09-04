import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHotel } from "../gateway/hotelGateway";

export const useCreateHotelMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createHotel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotels"] }),
  });
};
