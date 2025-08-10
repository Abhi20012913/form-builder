import { Parser } from "expr-eval";
import {  type DerivedField } from "../types/types";

export function computeDerivedValue(field: DerivedField, values: Record<string, any>) {
  if (field.builtIn === "ageFromDOB") {
    const pid = field.parentIds?.[0];
    if (!pid) return "";
    const val = values[pid];
    if (!val) return "";
    const date = typeof val === "number" ? new Date(val) : new Date(String(val));
    if (isNaN(date.getTime())) return "";
    const diff = Date.now() - date.getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    return years;
  }

  if (field.builtIn === "concat") {
    const parts = (field.parentIds || []).map((p) => values[p] ?? "");
    return parts.join(" ");
  }

 
  if (field.formula) {
    const parser = new Parser();
    const vars: Record<string, any> = { now: Date.now() };
    (field.parentIds || []).forEach((pid) => {
      const v = values[pid];
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) vars[pid] = d.getTime();
        else vars[pid] = v;
      } else {
        const n = Number(v);
        vars[pid] = isNaN(n) ? v : n;
      }
    });
    try {
      const out = parser.evaluate(field.formula, vars);
      return out;
    } catch (e) {
      console.warn("Derived eval error", e);
      return "";
    }
  }

  return "";
}
