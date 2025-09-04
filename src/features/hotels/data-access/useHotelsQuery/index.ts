import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../gateway/hotelGateway";

export const useHotelsQuery = () =>
  useQuery({ queryKey: ["hotels"], queryFn: getHotels });
