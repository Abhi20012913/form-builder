import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, Card, CardContent, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import FieldRenderer from "../../components/FieldRenderer";
import { validateFieldValue } from "../../utils/validators";
import { computeDerivedValue } from "../../utils/derived";
import { type FieldSchema } from "../../types/types";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const forms = useAppSelector((s) => s.forms.forms);
  const form = useMemo(() => forms.find((f) => f.id === id) ?? null, [forms, id]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [messageOpen, setMessageOpen] = useState(false);

  useEffect(() => {
    if (!form) return;
    const init: Record<string, any> = {};
    form.fields.forEach((f) => {
      init[f.id] = (f as any).defaultValue ?? (f.kind === "checkbox" ? [] : "");
    });
    form.fields.forEach((f) => {
      if (f.kind === "derived") {
        const val = computeDerivedValue(f as any, init);
        init[f.id] = val;
      }
    });
    setValues(init);
  }, [form]);

  if (!form) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Form not found</Typography>
      </Box>
    );
  }

  const recomputeDerivedAll = (vals: Record<string, any>) => {
    const derivedFields = form.fields.filter((f) => f.kind === "derived") as FieldSchema[];
    const maxPasses = derivedFields.length + 2;
    const next = { ...vals };
    for (let p = 0; p < maxPasses; p++) {
      let changed = false;
      for (const d of derivedFields) {
        const newv = computeDerivedValue(d as any, next);
        if (next[d.id] !== newv) {
          next[d.id] = newv;
          changed = true;
        }
      }
      if (!changed) break;
    }
    return next;
  };

  const handleChange = (id: string, value: any) => {
    setValues((prev) => {
      const next = { ...prev, [id]: value };
      const recomputed = recomputeDerivedAll(next);
      return recomputed;
    });
    const field = form.fields.find((f) => f.id === id);
    if (field) {
      const e = validateFieldValue(field, value);
      setErrors((prev) => ({ ...prev, [id]: e }));
    }
  };

  const handleSubmit = () => {
    const allErrors: Record<string, string[]> = {};
    for (const f of form.fields) {
      const e = validateFieldValue(f, values[f.id]);
      if (e.length) allErrors[f.id] = e;
    }
    setErrors(allErrors);
    if (Object.keys(allErrors).length === 0) {
      setMessageOpen(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {form.name}
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "grid", gap: 2 }}>
            {form.fields.map((f) => (
              <FieldRenderer
                key={f.id}
                field={f}
                value={values[f.id]}
                onChange={handleChange}
                readOnly={f.kind === "derived"}
                error={errors[f.id]?.[0] ?? null}
              />
            ))}
          </Box>

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button variant="contained" size="large" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={messageOpen}
        autoHideDuration={3000}
        onClose={() => setMessageOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" onClose={() => setMessageOpen(false)}>
          AS OF NOW WE ARE NOT ACCEPTING DETAILS
        </Alert>
      </Snackbar>
    </Box>
  );
}
