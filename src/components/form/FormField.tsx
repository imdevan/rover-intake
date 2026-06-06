import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { Surface } from "@/components/Surface";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  collapsible?: boolean;
  error?: string;
  index: number;
  children: ReactNode;
}

export function FormField({
  id,
  title,
  description,
  required,
  collapsible,
  error,
  index,
  children,
}: FormFieldProps) {
  const [open, setOpen] = useState(false);
  const expanded = !collapsible || open;
  const contentId = `${id}-content`;

  const HeaderTag = collapsible ? "button" : "div";
  const headerProps = collapsible
    ? {
        type: "button" as const,
        onClick: () => setOpen((o) => !o),
        "aria-expanded": expanded,
        "aria-controls": contentId,
      }
    : {};

  return (
    <Surface
      data-testid={`field-${id}`}
      error={!!error}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <HeaderTag
        {...headerProps}
        className={cn(
          "flex w-full items-start justify-between gap-3 text-left",
          collapsible && "cursor-pointer select-none",
        )}
      >
        <header className="flex-1">
          <label
            htmlFor={collapsible ? undefined : id}
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
        {collapsible && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
              expanded && "rotate-180 text-foreground",
            )}
          />
        )}
      </HeaderTag>

      <div
        id={contentId}
        // @ts-expect-error - inert is a valid HTML attr
        inert={!expanded ? "" : undefined}
        aria-hidden={!expanded}
        className={cn(
          "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
          expanded
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>

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
