import React from "react";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MainLayoutProps } from "./ChatLayout.types";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2196f3",
    },
  },
});

const ChatLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.100",
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default ChatLayout;
