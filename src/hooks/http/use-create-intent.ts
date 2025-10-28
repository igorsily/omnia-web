import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type CreateIntentRequest = {
  name: string;
  description?: string;
  questions?: string[];
  responses?: string[];
};

export function useCreateIntent() {
  return useMutation({
    mutationFn: async (data: CreateIntentRequest) => {
      const response = await api.post("/nlp/intents", data);
      return response.data;
    },
  });
}
