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
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Необходимо указать имя пользователя",
    })
    .min(3, { message: "Имя пользователя должно содержать минимум 3 символа" }),
  email: z
    .string()
    .min(1, {
      message: "Необходимо указать email",
    })
    .email({
      message: "Email должен быть корректным",
    }),
  password: z.string().min(1, {
    message: "Необходимо указать пароль",
  }),
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await fetch(
      "https://103.249.132.70:8443/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (response.ok) {
      await setAuthCookie(data.token);

      router.push("/");
    } else {
      setErrorMessage(data.message ?? "Ошибка регистрации");
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 w-[250px]"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="имя пользователя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button className="w-full" type="submit" disabled={isLoading}>
          {!isLoading && <span>зарегистрироваться</span>}
          {isLoading && <Loader2 className="animate-spin" />}
        </Button>
        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
      </form>
    </Form>
  );
}
