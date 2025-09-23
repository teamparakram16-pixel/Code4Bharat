// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NotificationProvider } from "./context/NotificationContext/NotificationContext.tsx";


createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </LocalizationProvider>
  </BrowserRouter>
  // </StrictMode>
);
