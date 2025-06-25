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
import { registerUser } from "@/api/auth/route";

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "необходимо указать имя пользователя",
    })
    .min(3, { message: "имя пользователя должно содержать минимум 3 символа" }),
  email: z
    .string()
    .min(1, {
      message: "необходимо указать email",
    })
    .email({
      message: "email должен быть корректным",
    }),
  password: z
    .string()
    .min(1, {
      message: "необходимо указать пароль",
    })
    .min(8, {
      message: "пароль должен содержать минимум 8 символов",
    })
    .regex(/[A-Z]/, {
      message: "пароль должен содержать хотя бы одну заглавную букву",
    }),
  passwordConfirm: z
    .string()
    .min(1, {
      message: "необходимо указать пароль",
    })
    .min(8, {
      message: "пароль должен содержать минимум 8 символов",
    })
    .regex(/[A-Z]/, {
      message: "пароль должен содержать хотя бы одну заглавную букву",
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
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (values.password !== values.passwordConfirm) {
      setErrorMessage("пароли не совпадают");
      setIsLoading(false);

      return;
    }

    const userResponse = await registerUser(JSON.stringify(values));
    const userData = await userResponse.json();

    if (userResponse.ok) {
      await setAuthCookie(userData.token);
      router.push("/");
    } else {
      setErrorMessage(userData.message.toLowerCase() ?? "Ошибка регистрации");
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
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
        <FormField
          control={form.control}
          name="passwordConfirm"
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
          {!isLoading && <span>зарегистрироваться</span>}
          {isLoading && <Loader2 className="animate-spin" />}
        </Button>
        {errorMessage && (
          <FormMessage className="text-center">{errorMessage}</FormMessage>
        )}
      </form>
    </Form>
  );
}
