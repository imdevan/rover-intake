import { z, type ZodTypeAny } from "zod";
import type { Question } from "./questions";

export function buildSchema(questions: Question[]) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const q of questions) {
    if (q.type === "checkboxes") {
      shape[q.id] = q.required
        ? z.array(z.string()).min(1, { message: "Please pick at least one option." })
        : z.array(z.string());
      continue;
    }
    const isEmail = q.type === "short" && q.inputType === "email";
    let s: ZodTypeAny = z.string().trim().max(2000);
    if (isEmail) {
      s = q.required
        ? (s as z.ZodString).email({ message: "Enter a valid email." })
        : (s as z.ZodString).refine((v) => v === "" || /.+@.+\..+/.test(v), {
            message: "Enter a valid email.",
          });
    }
    if (q.required) {
      s = z
        .string()
        .trim()
        .min(1, { message: "This field is required." })
        .max(2000)
        .pipe(s as never);
    }
    shape[q.id] = s;
  }
  return z.object(shape);
}
