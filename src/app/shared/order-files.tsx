import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "order-files";

type OrderFileRow = {
  id: string;
  file_url: string;
  file_path: string | null;
  file_type: "stl" | "obj" | "photo" | "other" | string;
  created_at: string;
};

function fileNameFromPath(path: string) {
  const p = path.split("/").pop();
  return p || path;
}

export default async function OrderFiles({
  orderId,
  files,
}: {
  orderId: string;
  files: OrderFileRow[];
}) {
  const supabase = await createClient();

  const signed = await Promise.all(
    files.map(async (f) => {
      const path = f.file_path ?? f.file_url;
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 10);
      return {
        ...f,
        path,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fișiere</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {signed.length ? (
          <ul className="space-y-2">
            {signed.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{fileNameFromPath(f.path)}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{f.file_type}</Badge>
                    <span>{f.created_at}</span>
                  </div>
                </div>
                {f.signedUrl ? (
                  <a
                    className="text-sm underline underline-offset-4"
                    href={f.signedUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Descarcă
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Nu pot genera link.</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nu există fișiere atașate.</p>
        )}
      </CardContent>
    </Card>
  );
}

