import { type ReactNode } from "react";
import { Markdown } from "@/components/Markdown";
import { Surface } from "@/components/Surface";

interface FormFieldProps {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  error?: string;
  index: number;
  children: ReactNode;
}

export function FormField({
  id,
  title,
  description,
  required,
  error,
  index,
  children,
}: FormFieldProps) {
  return (
    <Surface
      data-testid={`field-${id}`}
      error={!!error}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <header className="mb-3">
        <label
          htmlFor={id}
          className="flex items-baseline gap-1.5 text-lg font-bold text-foreground sm:text-xl"
        >
          <Markdown inline>{title}</Markdown>
          {required && (
            <span aria-hidden="true" className="text-primary">
              *
            </span>
          )}
        </label>
        {description && (
          <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
            <Markdown>{description}</Markdown>
          </div>
        )}
      </header>
      <div>{children}</div>
      {error && (
        <p
          role="alert"
          data-testid={`field-${id}-error`}
          className="mt-3 animate-fade-up text-sm font-bold text-destructive"
        >
          {error}
        </p>
      )}
    </Surface>
  );
}
