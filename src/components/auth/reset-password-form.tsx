"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setAuthCookie } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/api/auth/route";
import { toast } from "sonner";

const formSchema = z.object({
  password: z.string().min(1, {
    message: "необходимо указать пароль",
  }),
  passwordConfirmation: z.string().min(1, {
    message: "необходимо подтвердить пароль",
  }),
});

export function ResetPasswordForm({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.passwordConfirmation) {
      setError("пароли не совпадают");

      return;
    }

    setIsLoading(true);

    const response = await resetPassword(token, values.password);

    const data = await response.json();

    if (response.ok) {
      await setAuthCookie(data.token);

      router.push("/");

      toast.success("пароль успешно изменен");

      return;
    } else {
      setError(data.message ?? "ошибка при изменении пароля");
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="пароль" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="подтверждение пароля"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {!isLoading && <span>изменить пароль</span>}
          {isLoading && <Loader2 className="animate-spin" />}
        </Button>
        {error && <FormMessage className="text-center">{error}</FormMessage>}
      </form>
    </Form>
  );
}
