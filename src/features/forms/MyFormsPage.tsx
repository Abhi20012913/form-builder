import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteForm } from "./formsSlice";

export default function MyFormsPage() {
  const { forms } = useAppSelector((s) => s.forms);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Forms{" "}
        <Typography
          component="span"
          variant="subtitle1"
          color="text.secondary"
        >
          ({forms.length} total)
        </Typography>
      </Typography>

      <Card variant="outlined">
        <CardContent>
          {forms.length === 0 ? (
            <Typography color="text.secondary">No forms saved yet.</Typography>
          ) : (
            <List>
              {forms.map((f, i) => (
                <React.Fragment key={f.id}>
                  <ListItemButton
                    onClick={() => nav(`/preview/${f.id}`)}
                    sx={{
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {i + 1}. {f.name}
                        </Typography>
                      }
                      secondary={new Date(f.createdAt).toLocaleString()}
                    />
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteForm(f.id));
                      }}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemButton>
                  {i < forms.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
