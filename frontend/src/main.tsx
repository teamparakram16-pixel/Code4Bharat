import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext/NotificationContext'

// Create a default Material-UI theme
const theme = createTheme({
  // You can customize the theme here if needed
  palette: {
    mode: 'light',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
