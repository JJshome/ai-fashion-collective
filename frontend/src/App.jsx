import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DesignStudioPage from './pages/DesignStudioPage';
import DesignEvaluationPage from './pages/DesignEvaluationPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { DesignProvider } from './contexts/DesignContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DesignProvider>
          <NotificationProvider>
            <Router>
              <Header />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 200px)' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/design-studio" 
                    element={
                      <ProtectedRoute>
                        <DesignStudioPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/design-evaluation" 
                    element={
                      <ProtectedRoute>
                        <DesignEvaluationPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Container>
              <Footer />
            </Router>
          </NotificationProvider>
        </DesignProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;