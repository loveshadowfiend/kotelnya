import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function ForgotPasswordPage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle>забыли ваш пароль?</CardTitle>
          <CardDescription className="text-center">
            введите свою почту <br /> и получите ссылку для восстановления
            пароля
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center w-80 gap-3 lg:w-100">
          <ForgotPasswordForm />
          <Link className="text-sm underline" href="/auth/login">
            войти
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
