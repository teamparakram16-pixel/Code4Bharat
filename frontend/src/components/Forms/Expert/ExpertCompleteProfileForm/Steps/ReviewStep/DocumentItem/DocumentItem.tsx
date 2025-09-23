import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DocumentItemProps from "./DocumentItem.types";

const DocumentItem: React.FC<DocumentItemProps> = ({ title, file }) => (
  <ListItem>
    <ListItemIcon>
      <ArticleIcon color={file ? "success" : "error"} />
    </ListItemIcon>
    <ListItemText primary={title} secondary={file?.name || "Not uploaded"} />
  </ListItem>
);

export default DocumentItem;
