import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { FieldSchema } from "../types/types";
import { styled } from "@mui/material/styles";

interface Props {
  field: FieldSchema;
  value: any;
  onChange: (id: string, value: any) => void;
  readOnly?: boolean;
  error?: string | null;
}


const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#1e1e1e", 
    color: "#fff",
  },
  "& .MuiPickersDay-root": {
    color: "#fff",
  },
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function FieldRenderer({
  field,
  value,
  onChange,
  readOnly,
  error,
}: Props) {
  if (field.kind === "text" || field.kind === "number") {
    return (
      <TextField
        label={field.label}
        type={field.kind === "number" ? "number" : "text"}
        value={value ?? field.defaultValue ?? ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        fullWidth
        disabled={readOnly}
        helperText={error ?? ""}
        error={!!error}
      />
    );
  }

  if (field.kind === "date") {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledDatePicker
          label={field.label}
          value={value ?? null}
          onChange={(newValue) => onChange(field.id, newValue)}
          disabled={readOnly}
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: error ?? "",
              error: !!error,
            },
          }}
        />
      </LocalizationProvider>
    );
  }

  if (field.kind === "textarea") {
    return (
      <TextField
        label={field.label}
        multiline
        rows={4}
        value={value ?? field.defaultValue ?? ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        fullWidth
        disabled={readOnly}
        helperText={error ?? ""}
        error={!!error}
      />
    );
  }

  if (field.kind === "select") {
    return (
      <FormControl fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select
          value={value ?? field.defaultValue ?? ""}
          label={field.label}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={readOnly}
        >
          {(field as any).options?.map((opt: string) => (
            <MenuItem value={opt} key={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (field.kind === "radio") {
    return (
      <FormControl>
        <RadioGroup
          value={value ?? field.defaultValue ?? ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          {(field as any).options?.map((opt: string) => (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio />}
              label={opt}
              disabled={readOnly}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }

  if (field.kind === "checkbox") {
    const options = (field as any).options ?? ["Option 1"];
    const arr = Array.isArray(value) ? value : field.defaultValue ?? [];
    const toggle = (opt: string) => {
      const set = new Set(arr);
      if (set.has(opt)) set.delete(opt);
      else set.add(opt);
      onChange(field.id, Array.from(set));
    };
    return (
      <FormGroup>
        {options.map((opt: string) => (
          <FormControlLabel
            key={opt}
            control={
              <Checkbox
                checked={arr.includes(opt)}
                onChange={() => toggle(opt)}
              />
            }
            label={opt}
          />
        ))}
      </FormGroup>
    );
  }

  if (field.kind === "derived") {
    return (
      <TextField
        label={field.label}
        value={value ?? field.defaultValue ?? ""}
        fullWidth
        InputProps={{ readOnly: true }}
      />
    );
  }

  return null;
}
