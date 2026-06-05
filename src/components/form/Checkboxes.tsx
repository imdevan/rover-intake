import { Check } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";
import type { CheckboxOption } from "@/lib/questions";

interface CheckboxesProps {
  id: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (v: string[]) => void;
  invalid?: boolean;
}

export function Checkboxes({ id, options, value, onChange, invalid }: CheckboxesProps) {
  const toggle = (opt: CheckboxOption) => {
    const isChecked = value.includes(opt.label);
    if (isChecked) {
      onChange(value.filter((v) => v !== opt.label));
      return;
    }
    // Selecting a singular option clears everything else.
    if (opt.singular) {
      onChange([opt.label]);
      return;
    }
    // Selecting any non-singular option deselects all singular options.
    const singularLabels = new Set(
      options.filter((o) => o.singular).map((o) => o.label),
    );
    const next = value.filter((v) => !singularLabels.has(v));
    onChange([...next, opt.label]);
  };

  return (
    <ul
      role="group"
      aria-invalid={invalid || undefined}
      data-testid={`input-${id}`}
      className="flex flex-col gap-2"
    >
      {options.map((opt, i) => {
        const checked = value.includes(opt.label);
        const optId = `${id}-${i}`;
        return (
          <li key={opt.label}>
            <label
              htmlFor={optId}
              className={cn(
                "group flex cursor-pointer items-start gap-3 rounded-xl border border-input bg-background/40 px-4 py-3 transition-all duration-200",
                "hover:border-primary/60 hover:bg-primary-soft/40",
                "input-focus-within",
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
                <Markdown inline>{opt.label}</Markdown>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
