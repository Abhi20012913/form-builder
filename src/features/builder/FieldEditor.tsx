import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  MenuItem, 
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { FieldSchema, BaseField, DerivedField } from "../../types/types";

function makeId() {
  return Math.random().toString(36).substr(2, 9);
}

interface Props {
  field?: FieldSchema | null;
  allFields: FieldSchema[];
  onSave: (field: FieldSchema) => void;
  onCancel?: () => void;
}

export default function FieldEditor({ field, allFields, onSave, onCancel }: Props) {
  const isDerived = field?.kind === "derived";
  const [local, setLocal] = useState<FieldSchema>(
    field ??
      ({
        id: makeId(),
        kind: "text",
        label: "New field",
        required: false,
        defaultValue: "",
        validations: {},
      } as BaseField)
  );

  useEffect(() => {
    if (field) setLocal(field);
  }, [field]);

  const update = (patch: Partial<FieldSchema>) =>
    setLocal((l) => ({ ...(l as any), ...(patch as any) }));
  const asBase = (l: FieldSchema) => l as BaseField;
  const asDerived = (l: FieldSchema) => l as DerivedField;

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight="bold">
          Field Settings
        </Typography>
        <TextField
          label="Label"
          value={local.label}
          onChange={(e) => update({ label: e.target.value })}
          fullWidth
        />

        {!isDerived && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(asBase(local).required)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ required: e.target.checked } as any)}
                />
              }
              label="Required"
            />
            <TextField
              label="Default Value"
              value={asBase(local).defaultValue ?? ""}
              onChange={(e) => update({ defaultValue: e.target.value } as any)}
              fullWidth
            />
            <TextField
              select
              label="Validation: Pre-defined"
              value={asBase(local).validations?.email ? "email" : ""}
              onChange={(e) => {
                const v = { ...(asBase(local).validations ?? {}) };
                if (e.target.value === "email") v.email = true;
                else delete v.email;
                update({ validations: v } as any);
              }}
              helperText="Pick a sample validation (you can add more programmatically)"
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="email">Email format</MenuItem>
            </TextField>
          </>
        )}

        {(!isDerived &&
          (local.kind === "select" ||
            local.kind === "radio" ||
            local.kind === "checkbox")) && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Options
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
              {(asBase(local).options ?? []).map((opt, idx) => (
                <Chip
                  key={idx}
                  label={opt}
                  onDelete={() => {
                    const opts = [...(asBase(local).options ?? [])];
                    opts.splice(idx, 1);
                    update({ options: opts } as any);
                  }}
                />
              ))}
            </Stack>
            <AddOptionInput
              onAdd={(v) => {
                const opts = [...(asBase(local).options ?? []), v];
                update({ options: opts } as any);
              }}
            />
          </Box>
        )}

        {isDerived && (
          <>
            <Divider />
            <Typography variant="subtitle2" gutterBottom>
              Derived Field Settings
            </Typography>
            <TextField
              select
              label="Built-in (optional)"
              value={asDerived(local).builtIn ?? ""}
              onChange={(e) =>
                update({ builtIn: e.target.value || undefined } as any)
              }
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="ageFromDOB">ageFromDOB (DOB → Age)</MenuItem>
              <MenuItem value="concat">concat</MenuItem>
            </TextField>

            <TextField
              label="Parent fields (comma separated IDs)"
              value={(asDerived(local).parentIds ?? []).join(",")}
              onChange={(e) =>
                update({
                  parentIds: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                } as any)
              }
              helperText="You can also pick from below"
              fullWidth
            />

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {allFields
                .filter((f) => f.id !== local.id && f.kind !== "derived")
                .map((f) => {
                  const picked = (asDerived(local).parentIds ?? []).includes(f.id);
                  return (
                    <Chip
                      key={f.id}
                      label={f.label}
                      color={picked ? "primary" : "default"}
                      onClick={() => {
                        const set = new Set(asDerived(local).parentIds ?? []);
                        if (set.has(f.id)) set.delete(f.id);
                        else set.add(f.id);
                        update({ parentIds: Array.from(set) } as any);
                      }}
                    />
                  );
                })}
            </Stack>

            <TextField
              label="Custom Formula (optional)"
              value={asDerived(local).formula ?? ""}
              onChange={(e) => update({ formula: e.target.value } as any)}
              helperText="Use parent field ids as variables, `now` is available."
              fullWidth
            />
          </>
        )}

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={() => onSave(local)}>
            Save Field
          </Button>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

function AddOptionInput({ onAdd }: { onAdd: (v: string) => void }) {
  const [val, setVal] = React.useState("");
  return (
    <Stack direction="row" spacing={1}>
      <TextField
        size="small"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="New option"
        fullWidth
      />
      <IconButton
        onClick={() => {
          if (val.trim()) {
            onAdd(val.trim());
            setVal("");
          }
        }}
        size="large"
        color="primary"
      >
        <AddIcon />
      </IconButton>
    </Stack>
  );
}
