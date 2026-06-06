import { forwardRef } from "react";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  function SubmitButton({ loading, disabled, children = "Send it over" }, ref) {
    return (
      <button
        ref={ref}
        type="submit"
        data-testid="submit-button"
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        className={cn(
          "group relative inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-8 text-lg font-bold text-primary-foreground transition-all duration-300",
          "shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
          "hover:scale-[1.01] hover:shadow-[0_18px_60px_-12px_color-mix(in_oklab,var(--primary)_70%,transparent)]",
          "active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
          "disabled:cursor-not-allowed disabled:opacity-80",
          "sm:w-auto sm:min-w-64",
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-700 group-hover:translate-x-full"
        />
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span>{children}</span>
          </>
        )}
      </button>
    );
  },
);
