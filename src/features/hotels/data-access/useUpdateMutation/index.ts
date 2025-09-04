import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHotel } from "../gateway/hotelGateway";

export const useUpdateHotelMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => updateHotel(id, input),
    onSuccess: (hotel) => {
      qc.setQueryData(["hotel", hotel.id], hotel);
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
