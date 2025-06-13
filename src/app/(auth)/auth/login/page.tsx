import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle>вход в kotelnya</CardTitle>
          <CardDescription className="text-center">
            войдите в ваш аккаунт, и получите <br /> доступ к платформе
          </CardDescription>
          {/* <div className="text-xl font-bold mb-8">вход в kotelnya</div> */}
        </CardHeader>
        <CardContent className="flex flex-col items-center w-100 gap-3">
          <LoginForm />
          <Link className="text-sm underline" href="/auth/register">
            регистрация
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
