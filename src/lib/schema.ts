import { z, type ZodTypeAny } from "zod";
import type { Question } from "./questions";

export function buildSchema(questions: Question[]) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const q of questions) {
    if (q.type === "checkboxes") {
      let s: ZodTypeAny = z.array(z.string());
      if (q.required) {
        s = z.array(z.string()).min(1, { message: "Please pick at least one option." });
      }
      shape[q.id] = s;
    } else {
      const isEmail = q.type === "short" && q.inputType === "email";
      let s = z.string().trim().max(2000);
      if (isEmail) {
        s = q.required
          ? s.email({ message: "Enter a valid email." })
          : s.refine((v) => v === "" || /.+@.+\..+/.test(v), { message: "Enter a valid email." });
      }
      if (q.required) {
        s = s.min(1, { message: "This field is required." });
      }
      shape[q.id] = s;
    }
  }
  return z.object(shape);
}
