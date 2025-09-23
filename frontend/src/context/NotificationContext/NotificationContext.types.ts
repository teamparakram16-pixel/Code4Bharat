// Define the type for the context value
export interface NotificationContextType {
  snackbarOpen: boolean;
  setSnackbarOpen: (value: boolean) => void;
}