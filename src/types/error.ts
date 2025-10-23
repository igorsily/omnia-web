export type AppError = {
  message: string;
  status?: number;
  code?: string;
  cause?: unknown;
};

/**
 * Converte qualquer erro capturado (unknown) em um AppError seguro e tipado.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      cause: error.cause,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;

    const message =
      typeof errObj.message === "string" ? errObj.message : "Erro desconhecido";

    const status =
      typeof errObj.status === "number" ? errObj.status : undefined;

    const code = typeof errObj.code === "string" ? errObj.code : undefined;

    return {
      message,
      status,
      code,
      cause: errObj.cause,
    };
  }

  return { message: "Erro desconhecido" };
}
