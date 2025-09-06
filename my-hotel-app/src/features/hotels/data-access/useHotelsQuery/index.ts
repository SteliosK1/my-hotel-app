// src/features/hotels/data-access/useHotelsQuery/index.ts
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../gateway/hotelGateway";

export const useHotelsQuery = () =>
  useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
    // Caching
    staleTime: 1000 * 60 * 5,        // 5' θεωρούνται φρέσκα => δεν ξανακάνει fetch
    gcTime: 1000 * 60 * 30,          // 30' στον cache πριν "σκουπιστούν"
    refetchOnWindowFocus: false,     // όχι refetch όταν επιστρέφει το tab
    retry: 1,                        // ένα retry σε σφάλμα
  });
