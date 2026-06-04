import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LongInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  required?: boolean;
}

export function LongInput({ id, value, onChange, invalid, required }: LongInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 480)}px`;
  }, [value]);

  return (
    <textarea
      id={id}
      ref={ref}
      data-testid={`input-${id}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
      required={required}
      rows={2}
      className={cn(
        "w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-base font-normal text-foreground",
        "transition-all duration-200",
        "input-focus",
        invalid && "border-destructive focus:border-destructive focus:ring-destructive/20",
      )}
    />
  );
}
