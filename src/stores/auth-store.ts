import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";
import { type AppError, toAppError } from "@/types/error";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  username?: string | null | undefined;
  displayUsername?: string | null | undefined;
};

type AuthState = {
  user: User | null | undefined;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  fetchSession: () => Promise<void>;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean }>;
  logout: (showToast?: boolean) => Promise<{ success: boolean }>;
  refresh: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: undefined,
      loading: false,
      error: null,
      isAuthenticated: false,

      fetchSession: async () => {
        try {
          set({ loading: true });
          const session = await authClient.getSession();
          const user = session?.data?.user ?? null;

          if (user) {
            set({ user, isAuthenticated: true, error: null });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (err: unknown) {
          const error: AppError = toAppError(err);
          set({
            user: null,
            isAuthenticated: false,
            error: error.message ?? "Falha ao buscar sessão",
          });
        } finally {
          set({ loading: false });
        }
      },

      login: async (username, password) => {
        try {
          set({ loading: true, error: null });
          const result = await authClient.signIn.username({
            username,
            password,
          });

          if (result.error) {
            throw new Error(result.error.message);
          }

          await get().fetchSession();

          toast.success("Login realizado com sucesso");

          return { success: true };
        } catch (err: unknown) {
          const error: AppError = toAppError(err);
          set({ error: error.message });
          toast.error(error.message ?? "Erro ao fazer login");
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      logout: async (showToast = true) => {
        try {
          set({ loading: true });
          await authClient.signOut();

          set({ user: null, isAuthenticated: false, error: null });

          if (showToast) {
            toast.success("Logout realizado com sucesso");
          }
          return { success: true };
        } catch (err: unknown) {
          const error: AppError = toAppError(err);
          set({ error: error.message });
          toast.error(error.message ?? "Erro ao fazer logout");
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        await get().fetchSession();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
