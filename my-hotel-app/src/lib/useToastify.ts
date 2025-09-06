import { appToaster } from "./toaster";

export function useToastify() {
  return {
    ok: (title: string, desc?: string) =>
      appToaster.create({
        title,
        description: desc,
        type: "success",   // "info" | "loading" | "success" | "warning" | "error"
        duration: 3000,
      }),
    bad: (title: string, desc?: string) =>
      appToaster.create({
        title,
        description: desc,
        type: "error",
        duration: 4000,
      }),
  };
}
