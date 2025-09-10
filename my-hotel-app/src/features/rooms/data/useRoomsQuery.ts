import { useQuery } from "@tanstack/react-query";
import { fetchRooms } from "./roomGateway";
import type { RoomsFilters } from "./roomGateway";

export const useRoomsQuery = (filters: RoomsFilters) =>
  useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => fetchRooms(filters),
    enabled: !!filters.hotelId,     // χρειάζεται hotelId για το list-by-hotel
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
