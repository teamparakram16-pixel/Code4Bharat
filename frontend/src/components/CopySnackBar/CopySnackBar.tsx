import { FC } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotification } from "@/context/NotificationContext/NotificationContext";

const CopySnackbar: FC = () => {
  const { snackbarOpen, setSnackbarOpen } = useNotification();
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity="success"
        sx={{ width: "100%" }}
      >
        {"Link copied to clipboard!"}
      </Alert>
    </Snackbar>
  );
};

export default CopySnackbar;
