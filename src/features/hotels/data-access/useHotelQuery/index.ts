import { useQuery } from "@tanstack/react-query";
import { getHotelById } from "../gateway/hotelGateway";

export const useHotelQuery = (id: string) =>
  useQuery({ queryKey: ["hotel", id], queryFn: () => getHotelById(id), enabled: !!id });
