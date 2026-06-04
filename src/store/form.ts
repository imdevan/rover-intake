import { create } from "zustand";

export type FieldValue = string | string[];

interface FormState {
  values: Record<string, FieldValue>;
  errors: Record<string, string | undefined>;
  setValue: (id: string, value: FieldValue) => void;
  setErrors: (errors: Record<string, string | undefined>) => void;
  clearError: (id: string) => void;
  reset: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  values: {},
  errors: {},
  setValue: (id, value) =>
    set((s) => ({
      values: { ...s.values, [id]: value },
      errors: { ...s.errors, [id]: undefined },
    })),
  setErrors: (errors) => set({ errors }),
  clearError: (id) => set((s) => ({ errors: { ...s.errors, [id]: undefined } })),
  reset: () => set({ values: {}, errors: {} }),
}));
