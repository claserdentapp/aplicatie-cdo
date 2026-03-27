import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordForm from "./ui/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recuperare Parolă</CardTitle>
          <CardDescription>
            Introdu adresa de email pentru a primi un link de resetare.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ForgotPasswordForm />
          <p className="text-sm text-center text-muted-foreground mt-4">
            Îți amintești parola?{" "}
            <Link className="text-primary hover:underline underline-offset-4" href="/login">
              Înapoi la Autentificare
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
