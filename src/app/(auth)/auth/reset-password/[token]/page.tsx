import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";
import { checkResetToken } from "@/api/auth/route";

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const checkToken = await checkResetToken(token);
  const isValidToken = (await checkToken.json()).valid;

  if (!isValidToken) {
    return (
      <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
        <Card>
          <CardHeader className="flex items-center">
            <CardTitle>неверная ссылка ;(</CardTitle>
            <CardDescription className="text-center">
              ссылка для восстановления пароля <br /> недействительна или
              истекла
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <Link className="text-sm underline" href="/auth/forgot-password">
              запросить новую ссылку
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen w-screen items-center justify-center space-y-3">
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle>восстановление пароля</CardTitle>
          <CardDescription className="text-center">
            поменяйте ваш пароль
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center w-80 gap-3 lg:w-100">
          <ResetPasswordForm token={token} />
          <Link className="text-sm underline" href="/auth/login">
            войти
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
