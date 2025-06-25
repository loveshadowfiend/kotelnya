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
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import { forgotPassword, loginUser } from "@/api/auth/route";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "необходимо указать email",
    })
    .email({
      message: "email должен быть корректным",
    }),
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await forgotPassword(values.email);

    if (response.ok) {
      setError(null);
      setSuccess(
        "письмо с инструкциями по восстановлению пароля отправлено на ваш email"
      );
      form.reset();
    } else {
      setError(
        "ошибка при отправке письма... пожалуйста, проверьте введенный email и попробуйте еще раз"
      );
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {!isLoading && <span>восстановить пароль</span>}
          {isLoading && <Loader2 className="animate-spin" />}
        </Button>
        {error && <FormMessage className="text-center">{error}</FormMessage>}
        {success && (
          <FormMessage className="text-center text-accent-foreground">
            {success}
          </FormMessage>
        )}
      </form>
    </Form>
  );
}
