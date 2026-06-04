import { cn } from "@/lib/utils";

interface ShortInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  type?: "text" | "email";
  required?: boolean;
}

export function ShortInput({ id, value, onChange, invalid, type = "text", required }: ShortInputProps) {
  return (
    <div className="group relative">
      <input
        id={id}
        data-testid={`input-${id}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        required={required}
        autoComplete="off"
        className={cn(
          "peer w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-base font-normal text-foreground",
          "placeholder:text-muted-foreground/0",
          "transition-all duration-300 input-focus",
          invalid && "border-destructive focus:border-destructive",
        )}
      />
      {/*
          "focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15",
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-4 bottom-2 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-primary/0 transition-transform duration-500 peer-focus:scale-x-100",
          invalid && "from-destructive",
        )}
      />
      */}

    </div>
  );
}
