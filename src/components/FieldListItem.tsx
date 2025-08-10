import {
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import type { FieldSchema } from "../types/types";

interface Props {
  field: FieldSchema;
  index: number;
  total: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export default function FieldListItem({
  field,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <ListItem divider>
      <ListItemText
        primary={<Typography variant="subtitle1">{field.label}</Typography>}
        secondary={<Typography variant="caption">{field.kind}</Typography>}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          size="large"
        >
          <ArrowUpward />
        </IconButton>
        <IconButton
          edge="end"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          size="large"
        >
          <ArrowDownward />
        </IconButton>
        <IconButton edge="end" onClick={() => onEdit(field.id)} size="large">
          <EditIcon />
        </IconButton>
        <IconButton edge="end" onClick={() => onDelete(field.id)} size="large">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
