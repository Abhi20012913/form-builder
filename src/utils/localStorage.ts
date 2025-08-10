import { type FormSchema } from "../types/types";

const STORAGE_KEY = "myforms_v1";

export function loadForms(): FormSchema[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveForms(forms: FormSchema[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (e) {
    console.error("Failed to save forms", e);
  }
}
