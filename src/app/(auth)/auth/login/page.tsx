import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <div className="text-xl font-bold mb-8">вход в kotelnya</div>
      <LoginForm />
      <Link className="text-sm underline" href="/auth/register">
        регистрация
      </Link>
    </main>
  );
}
