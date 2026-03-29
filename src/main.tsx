import React, { JSX, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'
import AdminDashboard from './admin-dashboard/AdminDashboard'
import AdminAuth from './auth/AdminAuth'
import '@fortawesome/fontawesome-free/css/all.css'

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a5acd',
      light: '#9c8cff',
      dark: '#483d8b',
    },
    secondary: {
      main: '#ff7043',
      light: '#ffa270',
      dark: '#c63f17',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

// Auth guard function
const AuthGuard = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('pawfinderAdminUser');
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/login",
    element: <AdminAuth />
  },
  {
    path: "/",
    element: <Navigate to="/admin" replace />
  },
  {
    path: "/admin",
    element: <AuthGuard element={<AdminDashboard />} />
  },
  {
    path: "*",
    element: <Navigate to="/admin" replace />
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)