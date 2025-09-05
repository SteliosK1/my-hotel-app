import { useNavigate } from "react-router-dom";
import { useUpdateHotelMutation } from "../../../data-access/useUpdateMutation";
import { useToastify } from "@/lib/useToastify";
import type { HotelUpdateForm } from "../validationSchema/hotelUpdateSchema";

export function useHotelUpdateHandler(id: string) {
  const navigate = useNavigate();
  const mutation = useUpdateHotelMutation();
  const toast = useToastify();

  const onSubmit = async (values: HotelUpdateForm) => {
    try {
      const updated = await mutation.mutateAsync({
        id,
        input: {
          name: values.name,
          description: values.description,
          amenities: values.amenities ?? [],
        },
      });
      toast.ok("Hotel updated", updated.name);             // ✅ success message
      navigate(`/hotels/${updated.id}`);                   // ✅ return to details
    } catch (e: any) {
      toast.bad("Update failed", e?.message ?? "Error");   // error toast
      throw e;
    }
  };

  return {
    onSubmit,
    isSubmitting: mutation.isPending,
  };
}
