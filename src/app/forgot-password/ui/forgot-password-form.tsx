"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      toast.error("A apărut o eroare.", { description: error.message });
      return;
    }

    setSent(true);
    toast.success("Email trimis cu succes. Verifică-ți căsuța Inbox.");
  }

  if (sent) {
    return (
      <div className="bg-muted p-4 rounded-lg text-center text-sm space-y-2">
        <p className="font-semibold text-primary mb-2">Verifică-ți adresa de email!</p>
        <p className="text-muted-foreground">Ți-am trimis la {email} un link pentru resetarea parolei.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button className="w-full gap-2" type="submit" disabled={loading}>
        {loading ? "Se trimite cererea..." : (
          <>
            <Send className="w-4 h-4" />
            Trimite link resetare
          </>
        )}
      </Button>
    </form>
  );
}
