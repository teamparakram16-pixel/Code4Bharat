import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Share } from "@mui/icons-material";
import { SuccessStoryCardProps } from "../SuccessStoryPostCard.types";

export const PostMenu = ({
  anchorEl,
  open,
  onClose,
  menuItems,
  handleShareClick
}: {
  anchorEl: HTMLElement | null,
  open: boolean,
  onClose: () => void,
  menuItems: SuccessStoryCardProps['menuItems'],
  handleShareClick: (event: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 180,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        },
      }}
    >
      <MenuItem
        onClick={handleShareClick}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(5, 150, 105, 0.08)",
          },
        }}
      >
        <ListItemIcon sx={{ color: "rgb(5, 150, 105)" }}>
          <Share fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Share" />
      </MenuItem>
      
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            onClose();
            item.action();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(5, 150, 105, 0.08)",
              ...(item.label === "Delete" ? {
                backgroundColor: "rgba(255, 0, 0, 0.08)"
              } : {})
            },
          }}
        >
          <ListItemIcon sx={{ 
            color: item.label === "Delete" ? "error.main" : "rgb(5, 150, 105)" 
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label} 
            sx={item.label === "Delete" ? { color: "error.main" } : {}} 
          />
        </MenuItem>
      ))}
    </Menu>
  );
};