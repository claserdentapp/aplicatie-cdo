import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "./ui/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Setare Parolă Nouă</CardTitle>
          <CardDescription>
            Introdu noua parolă pentru contul tău.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
