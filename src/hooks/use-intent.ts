import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { ApiPaginatedResponse } from "@/types/api";

export type FetchUsersParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const intentTableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IntentTable = z.infer<typeof intentTableSchema>;

const fetchIntents = async (): Promise<ApiPaginatedResponse<IntentTable>> => {
  const response = await fetch("http://localhost:3333/api/nlp/intents", {
    method: "GET",
    credentials: "include",
  });

  const body: ApiPaginatedResponse<IntentTable> = await response.json();
  return body;
};

export function useIntents() {
  return useQuery({
    queryKey: ["intents"],
    queryFn: () => fetchIntents(),
  });
}
