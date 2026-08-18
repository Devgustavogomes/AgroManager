import { useForm } from "react-hook-form";

import { Button } from "../../../../components/ui/Button";
import {
  loginSchema,
  type LoginCredentials,
} from "../../../../types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../../services/auth.service";
import { useAuth } from "../../../../hooks/useAuth";
import { Input } from "../../../../components/ui/Input";
import { useToast } from "../../../../hooks/useToast";

export function LoginPage() {
  const { signIn } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await authService.login(credentials);
    },
    onSuccess: (data) => {
      signIn(data);
    },
    onError: (error) => {
      console.error("Falha ao logar:", error);
      toast({
        intent: "danger",
        message: "Credenciais inválidas ou servidor indisponível.",
      });
    },
  });

  const handleLogin = handleSubmit(async (data) => {
    mutation.mutate(data);
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-base px-4">

      <section className="w-full max-w-md rounded-lg bg-surface-paper p-8 shadow-card space-y-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-content-primary">
            AgroManager
          </h1>
          <h4 className="mt-2 text-lg text-content-secondary">
            Insira suas credenciais para acessar o painel
          </h4>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            {...register("email")}
            placeholder="Email"
            error={errors.email?.message}
            className="w-full border border-gray-300 px-4 py-2"
          />
          <Input
            type="password"
            {...register("password")}
            placeholder="Senha"
            error={errors.password?.message}
            className="w-full px-4 py-2"
          />

          <Button
            type="submit"
            intent="primary"
            size="lg"
            className="w-full mt-6"
            isLoading={mutation.isPending}
          >
            Entrar no sistema
          </Button>
        </form>
      </section>
    </main>
  );
}
