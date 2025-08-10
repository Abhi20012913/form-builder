import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks";
import FieldListItem from "../../components/FieldListItem";
import FieldEditor from "./FieldEditor";
import {
  addField,
  moveField,
  removeField,
  updateField,
  setFormName,
} from "./builderSlice";
import { saveForm } from "../forms/formsSlice";
import { makeId } from "../../types/types";

export default function BuilderPage() {
  const dispatch = useAppDispatch();
  const { fields, name } = useAppSelector((s) => s.builder);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState(name);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const onAdd = (kind: any) => dispatch(addField({ kind }));
  const onEdit = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };
  const onDelete = (id: string) => dispatch(removeField(id));
  const onMoveUp = (index: number) =>
    dispatch(moveField({ from: index, to: index - 1 }));
  const onMoveDown = (index: number) =>
    dispatch(moveField({ from: index, to: index + 1 }));

  const fieldToEdit = fields.find((f) => f.id === editingId) ?? null;

  const onSaveField = (f: any) => {
    dispatch(updateField(f));
    setEditorOpen(false);
    setEditingId(null);
  };

  const onSaveFormToStorage = () => {
    const form = {
      id: makeId(),
      name: saveName || "Untitled",
      createdAt: new Date().toISOString(),
      fields,
    };
    dispatch(saveForm(form));
    setSaveDialogOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center">
        Form Builder
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mt: 3,
        }}
      >

        <Box
          sx={{
            flexBasis: { xs: "100%", md: "70%" },
            maxWidth: { xs: "100%", md: "70%" },
          }}
        >
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Add Fields
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
                {[
                  "text",
                  "number",
                  "textarea",
                  "select",
                  "radio",
                  "checkbox",
                  "date",
                  "derived",
                ].map((k) => (
                  <Button
                    key={k}
                    variant="outlined"
                    size="small"
                    onClick={() => onAdd(k)}
                    aria-label={`Add ${k} field`}
                  >
                    {k}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Fields
              </Typography>

              {fields.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", p: 1 }}
                >
                  No fields added yet. Use the buttons above to add fields.
                </Typography>
              ) : (
                <List
                  dense
                  sx={{
                    maxHeight: 360,
                    overflowY: "auto",
                    borderRadius: 1,
                  }}
                >
                  {fields.map((f, idx) => (
                    <FieldListItem
                      key={f.id}
                      field={f}
                      index={idx}
                      total={fields.length}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onMoveUp={onMoveUp}
                      onMoveDown={onMoveDown}
                    />
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>


        <Box
          sx={{
            flexBasis: { xs: "100%", md: "30%" },
            maxWidth: { xs: "100%", md: "30%" },
          }}
        >
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Form Metadata
              </Typography>
              <TextField
                label="Form Name"
                value={name}
                onChange={(e) => dispatch(setFormName(e.target.value))}
                fullWidth
                sx={{ mb: 3 }}
                autoFocus
              />
              <Box textAlign="right">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setSaveDialogOpen(true);
                    setSaveName(name);
                  }}
                >
                  Save Form
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Field</DialogTitle>
        <DialogContent dividers>
          <FieldEditor
            field={fieldToEdit}
            allFields={fields}
            onSave={onSaveField}
            onCancel={() => setEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Form Name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={onSaveFormToStorage} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Form saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
