import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Email,
  Link,
} from "@mui/icons-material";
import { ShareMenuProps } from "./ShareMenu.types";
import { useNotification } from "@/context/NotificationContext/NotificationContext";

const ShareMenu: React.FC<ShareMenuProps> = ({
  anchorEl,
  open,
  onClose,
  postTitle,
}) => {
  const { setSnackbarOpen } = useNotification();

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(postTitle);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${title}&body=Check%20this%20out:%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `Check out this post: ${postTitle}\n\n${window.location.href}...`
    );
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 3000);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem onClick={() => shareOnSocialMedia("facebook")}>
        <ListItemIcon>
          <Facebook color="primary" />
        </ListItemIcon>
        <ListItemText>Share on Facebook</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => shareOnSocialMedia("twitter")}>
        <ListItemIcon>
          <Twitter color="info" />
        </ListItemIcon>
        <ListItemText>Share on Twitter</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => shareOnSocialMedia("linkedin")}>
        <ListItemIcon>
          <LinkedIn color="primary" />
        </ListItemIcon>
        <ListItemText>Share on LinkedIn</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => shareOnSocialMedia("whatsapp")}>
        <ListItemIcon>
          <WhatsApp color="success" />
        </ListItemIcon>
        <ListItemText>Share on WhatsApp</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => shareOnSocialMedia("email")}>
        <ListItemIcon>
          <Email color="action" />
        </ListItemIcon>
        <ListItemText>Share via Email</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={copyToClipboard}>
        <ListItemIcon>
          <Link color="action" />
        </ListItemIcon>
        <ListItemText>Copy Link</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ShareMenu;
