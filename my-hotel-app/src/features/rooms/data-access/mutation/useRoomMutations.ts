import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom, updateRoom, deleteRoom } from "../gateway/roomGateway";
import type { RoomType } from "../../domain/types";
import { useToastify } from "@/lib/useToastify"; // δικό σου hook

// -----------------------------
// Helpers
// -----------------------------
function extractErrorMessage(e: any): string {
  const s = e?.response?.status;
  if (s === 409) return "That room number already exists in this hotel.";
  if (s === 404) return "Room not found.";
  if (s === 400) return "Please check the form fields.";
  return (
    e?.response?.data?.error ||
    e?.response?.data?.message ||
    e?.message ||
    "Something went wrong"
  );
}

// -----------------------------
// Input types
// -----------------------------
export type CreateRoomInput = {
  hotelId: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
};

export type UpdateRoomInput = {
  hotelId: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
};

// -----------------------------
// Mutations με ok / bad toasts
// -----------------------------
export function useCreateRoom(hotelId: string) {
  const qc = useQueryClient();
  const { ok, bad } = useToastify();

  return useMutation({
    mutationFn: (values: CreateRoomInput) => createRoom(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms", { hotelId }] });
      ok("Room created successfully");
    },
    onError: (e) => {
      bad(extractErrorMessage(e));
    },
  });
}

export function useUpdateRoom(hotelId: string) {
  const qc = useQueryClient();
  const { ok, bad } = useToastify();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoomInput }) =>
      updateRoom(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms", { hotelId }] });
      ok("Room updated successfully");
    },
    onError: (e) => {
      bad(extractErrorMessage(e));
    },
  });
}

export function useDeleteRoom(hotelId: string) {
  const qc = useQueryClient();
  const { ok, bad } = useToastify();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onMutate: async (id: string) => {
      const key = ["rooms", { hotelId }];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<any[]>(key);
      if (prev) qc.setQueryData<any[]>(key, prev.filter((r) => r.id !== id));
      return { prev, key };
    },
    onError: (e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key!, ctx.prev);
      bad(extractErrorMessage(e));
    },
    onSuccess: () => {
      ok("Room deleted successfully");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["rooms", { hotelId }] }),
  });
}
