import { useNavigate } from "react-router-dom";
import { useToastify } from "@/lib/useToastify";
import { useCreateHotelMutation } from "../data-access/useCreateMutation";
import { useUpdateHotelMutation } from "../data-access/useUpdateMutation";
import type { HotelFormValues } from "../schemas/hotelSchema";

type Params = { id?: string };

export function useHotelSave({ id }: Params = {}) {
  const nav = useNavigate();
  const t = useToastify();
  const createM = useCreateHotelMutation();
  const updateM = useUpdateHotelMutation();

  const isUpdate = Boolean(id);
  const isSubmitting = isUpdate ? updateM.isPending : createM.isPending;

  const onSubmit = async (values: HotelFormValues) => {
    try {
      if (isUpdate && id) {
        const updated = await updateM.mutateAsync({
          id,
          input: {
            name: values.name,
            description: values.description,
            amenities: values.amenities ?? [],
          },
        });
        t.ok("Hotel updated", updated.name);
        nav(`/hotels/${updated.id}`);
      } else {
        const created = await createM.mutateAsync({
          name: values.name,
          description: values.description,
          amenities: values.amenities ?? [],
        });
        t.ok("Hotel created", created?.name ?? "");
        nav(created?.id ? `/hotels/${created.id}` : "/hotels");
      }
    } catch (e: any) {
      t.bad(isUpdate ? "Update failed" : "Create failed", e?.response?.data?.message ?? e?.message ?? "Unknown error");
      throw e;
    }
  };

  return { onSubmit, isSubmitting };
}
