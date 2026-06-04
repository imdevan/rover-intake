import { Check } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";

interface CheckboxesProps {
  id: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  invalid?: boolean;
}

export function Checkboxes({ id, options, value, onChange, invalid }: CheckboxesProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <ul
      role="group"
      aria-invalid={invalid || undefined}
      data-testid={`input-${id}`}
      className="flex flex-col gap-2"
    >
      {options.map((opt, i) => {
        const checked = value.includes(opt);
        const optId = `${id}-${i}`;
        return (
          <li key={opt}>
            <label
              htmlFor={optId}
              className={cn(
                "group flex cursor-pointer items-start gap-3 rounded-xl border border-input bg-background/40 px-4 py-3 transition-all duration-200",
                "hover:border-primary/60 hover:bg-primary-soft/40",
                "has-[:focus-visible]:border-primary has-[:focus-visible]:shadow-[0_0_40px_-5px_color-mix(in_oklab,var(--primary)_45%,transparent)]",
                checked && "border-primary bg-primary-soft/60",
                invalid && !checked && "border-destructive/50",
              )}
            >
              <input
                id={optId}
                data-testid={`${id}-option-${i}`}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                  checked
                    ? "scale-100 border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background/80 text-transparent group-hover:border-primary/60",
                )}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    checked ? "scale-100" : "scale-0",
                  )}
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm leading-relaxed text-foreground sm:text-base">
                <Markdown inline>{opt}</Markdown>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
