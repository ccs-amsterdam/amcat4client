import { AlertTriangle } from "lucide-react";

export function ErrorMsg({ type, children }: { type?: string; children?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-12">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      {type ? <h2 className="mt-3 text-xl font-bold text-destructive/60">{type}</h2> : null}
      <h3 className="mt-3 rounded p-5 text-xl">{children}</h3>
    </div>
  );
}
