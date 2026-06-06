import raw from "../data/questions.jsonc?raw";

export type QuestionType = "short" | "long" | "checkboxes";

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  hint?: string;
  required?: boolean;
  collapsible?: boolean;
}

export interface ShortQuestion extends BaseQuestion {
  type: "short";
  inputType?: "text" | "email";
}

export interface LongQuestion extends BaseQuestion {
  type: "long";
}

export interface CheckboxOption {
  label: string;
  singular?: boolean;
}

export interface CheckboxesQuestion extends BaseQuestion {
  type: "checkboxes";
  options: CheckboxOption[];
}

export type Question = ShortQuestion | LongQuestion | CheckboxesQuestion;

export interface QuestionsConfig {
  title: string;
  titleFooter?: string;
  titleFooterTooltip?: string;
  subtitle: string;
  submitUrl: string;
  questions: Question[];
}

// Minimal JSONC parser: strip // line comments and /* block */ comments,
// then strip trailing commas before JSON.parse.
function stripJsonc(input: string): string {
  let out = "";
  let i = 0;
  let inString = false;
  let stringChar = "";
  while (i < input.length) {
    const c = input[i];
    const n = input[i + 1];
    if (inString) {
      out += c;
      if (c === "\\" && i + 1 < input.length) {
        out += input[i + 1];
        i += 2;
        continue;
      }
      if (c === stringChar) inString = false;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      stringChar = c;
      out += c;
      i++;
      continue;
    }
    if (c === "/" && n === "/") {
      while (i < input.length && input[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && n === "*") {
      i += 2;
      while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");
}

interface RawConfig extends Omit<QuestionsConfig, "questions"> {
  questions: Array<
    | ShortQuestion
    | LongQuestion
    | (Omit<CheckboxesQuestion, "options"> & {
        options: Array<string | CheckboxOption>;
      })
  >;
}

const parsed = JSON.parse(stripJsonc(raw)) as RawConfig;

export const questionsConfig: QuestionsConfig = {
  ...parsed,
  questions: parsed.questions.map((q) => {
    if (q.type !== "checkboxes") return q;
    return {
      ...q,
      options: q.options.map((o) =>
        typeof o === "string" ? { label: o } : o,
      ),
    };
  }),
};
