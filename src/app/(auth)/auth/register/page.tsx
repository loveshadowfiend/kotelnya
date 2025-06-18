import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle>регистрация в kotelnya</CardTitle>
          <CardDescription className="text-center">
            зарегистрируйте ваш аккаунт, и получите <br /> доступ к платформе
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center w-80 gap-3 lg:w-100">
          <RegisterForm />
          <Link className="text-sm underline" href="/auth/login">
            войти
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
