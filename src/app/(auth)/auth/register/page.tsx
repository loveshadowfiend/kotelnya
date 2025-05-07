import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <div className="text-xl font-bold mb-8">регистрация</div>
      <RegisterForm />
      <Link className="text-sm underline" href="/auth/login">
        войти
      </Link>
    </main>
  );
}
