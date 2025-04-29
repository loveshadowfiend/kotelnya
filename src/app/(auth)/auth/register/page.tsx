import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <div className="text-xl font-bold mb-8">регистрация</div>
      <RegisterForm />
    </main>
  );
}
