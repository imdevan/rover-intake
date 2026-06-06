import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { useFormStore, type FieldValue } from "@/store/form";
import { questionsConfig, type Question } from "@/lib/questions";
import { buildSchema } from "@/lib/schema";
import { FormField } from "@/components/form/FormField";
import { ShortInput } from "@/components/form/ShortInput";
import { LongInput } from "@/components/form/LongInput";
import { Checkboxes } from "@/components/form/Checkboxes";
import { SubmitButton } from "@/components/form/SubmitButton";
import { CheckCircle2 } from "lucide-react";

const schema = buildSchema(questionsConfig.questions);

function defaultValue(q: Question): FieldValue {
  return q.type === "checkboxes" ? [] : "";
}

function fireConfettiFrom(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  const colors = ["#00bd70", "#7ce0b0", "#ffd166", "#06d6a0", "#ffffff"];
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 45,
    origin: { x, y },
    colors,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      angle: 60,
      origin: { x: x - 0.05, y },
      colors,
    });
    confetti({
      particleCount: 60,
      spread: 100,
      angle: 120,
      origin: { x: x + 0.05, y },
      colors,
    });
  }, 120);
}

export function IntakeForm() {
  const { values, errors, setValue, setErrors, reset } = useFormStore();
  const submitRef = useRef<HTMLButtonElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, FieldValue>) => {
      const res = await fetch(questionsConfig.submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      try {
        return await res.json();
      } catch {
        return { ok: true };
      }
    },
    onSuccess: () => {
      setSubmitted(true);
      if (submitRef.current) fireConfettiFrom(submitRef.current);
      reset();
    },
  });

  const getValue = (q: Question): FieldValue =>
    values[q.id] ?? defaultValue(q);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, FieldValue> = {};
    for (const q of questionsConfig.questions) data[q.id] = getValue(q);

    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // Scroll first error into view
      const firstId = result.error.issues[0]?.path[0];
      if (firstId) {
        const el = document.querySelector(`[data-testid="field-${firstId}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setErrors({});
    mutation.mutate(result.data as Record<string, FieldValue>);
  };

  if (submitted) {
    return (
      <div
        data-testid="success-card"
        className="glass-surface animate-fade-up rounded-2xl p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" strokeWidth={2.2} />
        <h2 className="mt-4 text-2xl font-[1000] tracking-tight text-foreground">
          All set — thank you!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Your pup's intake form is on its way. Talk soon!
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            mutation.reset();
          }}
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-input bg-background/60 px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-testid="intake-form"
      className="flex flex-col gap-5"
    >
      {questionsConfig.questions.map((q, i) => {
        const value = getValue(q);
        const error = errors[q.id];
        return (
          <FormField
            key={q.id}
            id={q.id}
            title={q.title}
            description={q.description}
            required={q.required}
            collapsible={q.collapsible}
            error={error}
            index={i}
          >
            {q.type === "short" && (
              <ShortInput
                id={q.id}
                type={q.inputType ?? "text"}
                value={value as string}
                onChange={(v) => setValue(q.id, v)}
                invalid={!!error}
                required={q.required}
              />
            )}
            {q.type === "long" && (
              <LongInput
                id={q.id}
                value={value as string}
                onChange={(v) => setValue(q.id, v)}
                invalid={!!error}
                required={q.required}
              />
            )}
            {q.type === "checkboxes" && (
              <Checkboxes
                id={q.id}
                options={q.options}
                value={value as string[]}
                onChange={(v) => setValue(q.id, v)}
                invalid={!!error}
              />
            )}
          </FormField>
        );
      })}

      {mutation.isError && (
        <div
          role="alert"
          className="glass-surface rounded-2xl border border-destructive/40 p-4 text-sm font-bold text-destructive"
        >
          Something went wrong submitting the form. Please try again.
        </div>
      )}

      <div
        className="animate-fade-up pt-2"
        style={{ animationDelay: `${questionsConfig.questions.length * 70}ms` }}
      >
        <SubmitButton ref={submitRef} loading={mutation.isPending} />
      </div>
    </form>
  );
}
