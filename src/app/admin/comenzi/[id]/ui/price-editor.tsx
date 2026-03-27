"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DollarSign, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function PriceEditor({
  orderId,
  currentPrice,
}: {
  orderId: string;
  currentPrice: number | null;
}) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState<string>(
    currentPrice !== null ? currentPrice.toString() : ""
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    const val = parseFloat(price);
    if (isNaN(val) && price.trim() !== "") {
      toast.error("Adaugă o valoare numerică validă pentru preț.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const finalPrice = price.trim() === "" ? null : val;

    const { error } = await supabase
      .from("orders")
      .update({ pret: finalPrice })
      .eq("id", orderId);

    setSaving(false);
    if (error) {
      toast.error("Nu am putut actualiza prețul.", { description: error.message });
      return;
    }

    toast.success("Preț actualizat cu succes.");
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between mt-2 pt-2 border-t text-sm">
        <div className="text-muted-foreground">Cost estimat de laborator:</div>
        <div className="flex items-center gap-2">
          {currentPrice !== null ? (
            <span className="font-semibold text-lg text-primary">{currentPrice} RON</span>
          ) : (
            <span className="text-muted-foreground italic">Nefacturat</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-primary"
            onClick={() => setEditing(true)}
          >
            Modifică
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">Confirmare preț lucrare (RON)</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex: 550"
            className="pl-8"
            disabled={saving}
          />
        </div>
        <Button onClick={save} disabled={saving} size="icon" className="shrink-0 bg-primary">
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setPrice(currentPrice !== null ? currentPrice.toString() : "");
            setEditing(false);
          }}
          disabled={saving}
        >
          Anulare
        </Button>
      </div>
    </div>
  );
}
