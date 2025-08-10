import  { useState } from "react";
import {
  Box,
  Grid,
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Form Builder
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Field
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
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
                  >
                    {k}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
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
                <List dense>
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
        </Grid>

        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form Metadata
              </Typography>
              <TextField
                label="Form Name"
                value={name}
                onChange={(e) => dispatch(setFormName(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
              />
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
