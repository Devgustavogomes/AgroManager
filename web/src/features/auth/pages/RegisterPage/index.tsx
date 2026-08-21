import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  registerSchema,
  type RegisterCredentials,
  type RegisterPayload,
} from "../../../../types/auth.type";
import { authService } from "../../../../services/auth.service";
import { useAuth } from "../../../../hooks/useAuth";
import { useToast } from "../../../../hooks/useToast";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { PasswordInput } from "../../components/PasswordInput";

export function RegisterPage() {
  const { signIn } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      const payload: RegisterPayload = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      await authService.register(payload);

      const authData = await authService.login({
        email: data.email,
        password: data.password,
      });
      return authData;
    },
    onSuccess: (data) => {
      signIn(data);
    },
    onError: (error) => {
      console.error("Falha ao cadastrar:", error);
      toast({
        intent: "danger",
        message: "Erro ao criar conta. Verifique os dados e tente novamente.",
      });
    },
  });

  const handleRegister = handleSubmit(async (data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-lg bg-surface-paper p-8 shadow-card space-y-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-content-primary">
            AgroManager
          </h1>
          <h4 className="mt-2 text-lg text-content-secondary">
            Crie sua conta para começar
          </h4>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            {...register("username")}
            placeholder="Nome de usuário"
            error={errors.username?.message}
          />
          <Input
            type="email"
            {...register("email")}
            placeholder="Email"
            error={errors.email?.message}
          />
          <Input
            type="email"
            {...register("confirmEmail")}
            placeholder="Confirmar email"
            error={errors.confirmEmail?.message}
          />
          <PasswordInput
            {...register("password")}
            placeholder="Senha"
            error={errors.password?.message}
          />
          <PasswordInput
            {...register("confirmPassword")}
            placeholder="Confirmar senha"
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            intent="primary"
            size="lg"
            className="w-full mt-6"
            isLoading={mutation.isPending}
          >
            Criar conta
          </Button>
        </form>
        <p className="text-center text-sm text-content-secondary">
          Já possui uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-agro-main hover:underline"
          >
            Faça login
          </Link>
        </p>
      </section>
    </div>
  );
}
