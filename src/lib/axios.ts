import axios, { type AxiosError } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request (adiciona token se houver)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Interceptor de response (tratamento de erros globais)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Não autenticado, redirecionando...");
      // Exemplo: redirecionar pro login
      // router.navigate({ to: "/login" });
    }

    if (error.response?.status === 500) {
      console.error("Erro interno do servidor");
    }

    return Promise.reject(error);
  }
);
