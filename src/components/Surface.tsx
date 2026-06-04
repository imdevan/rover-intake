import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  error?: boolean;
}

export function Surface({ className, error, children, ...rest }: SurfaceProps) {
  return (
    <div
      className={cn(
        "glass-surface animate-fade-up rounded-2xl p-6 sm:p-8",
        error && "ring-2 ring-destructive/60",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

// "glass-surface animate-fade-up rounded-2xl p-6 sm:p-8",
// "transition-shadow duration-300 hover:shadow-[0_18px_60px_-30px_color-mix(in_oklab,var(--primary)_45%,transparent)]",
