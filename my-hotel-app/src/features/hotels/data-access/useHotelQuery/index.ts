import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHotelById } from "../gateway/hotelGateway";
import type { Hotel } from "../../domain/hotel";

export const useHotelQuery = (id: string) => {
  const qc = useQueryClient();

  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => getHotelById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    placeholderData: () => {
      const list = qc.getQueryData<Hotel[]>(["hotels"]);
      return list?.find((h) => h.id === id);
    },
  });
};
