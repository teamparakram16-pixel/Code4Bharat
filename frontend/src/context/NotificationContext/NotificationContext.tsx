import { createContext, useContext, useState, ReactNode } from "react";
import { NotificationContextType } from "./NotificationContext.types";

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Context provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <NotificationContext.Provider value={{ snackbarOpen, setSnackbarOpen }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
