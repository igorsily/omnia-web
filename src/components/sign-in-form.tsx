import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/auth-store";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

export default function SignInForm() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      username: "igorsily",
      password: "10342512ws",
    },
    onSubmit: async ({ value }) => {
      const response = await login(value.username, value.password);

      if (response.success) {
        navigate({ to: "/dashboard" });
      }
    },
    validators: {
      onSubmit: z.object({
        username: z
          .string()
          .min(2, "Nome de usuário deve ter pelo menos 2 caracteres"),
        password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <Card className="mx-auto my-auto w-full max-w-lg">
      <CardContent>
        <div className="mx-auto mt-10 w-full max-w-md p-6">
          <h1 className="mb-6 text-center font-bold text-3xl">Bem vindo!</h1>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <form.Field name="username">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Usuário</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Senha</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Subscribe>
              {(state) => (
                <Button
                  className="w-full disabled:cursor-not-allowed"
                  disabled={!state.canSubmit || state.isSubmitting}
                  type="submit"
                >
                  {state.isSubmitting ? <Spinner /> : "Entrar"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
