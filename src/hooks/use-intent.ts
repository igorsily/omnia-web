import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/axios";
import type { ApiPaginatedResponse, FetchParams } from "@/types/api";

export const intentTableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IntentTable = z.infer<typeof intentTableSchema>;

const fetchIntents = async (
  params: FetchParams
): Promise<ApiPaginatedResponse<IntentTable>> => {
  const response = await api.get("/nlp/intents", {
    params,
  });

  return response.data as ApiPaginatedResponse<IntentTable>;
};

export function useIntents(params: FetchParams = {}) {
  return useQuery({
    queryKey: ["intents", params],
    queryFn: () => fetchIntents(params),
  });
}
