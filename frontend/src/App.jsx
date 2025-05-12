import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { DesignProvider } from './context/DesignContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DesignDetail from './pages/DesignDetail';
import CreateDesign from './pages/CreateDesign';
import EditDesign from './pages/EditDesign';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EvaluationPage from './pages/EvaluationPage';
import NotFound from './pages/NotFound';
import AiGenerator from './pages/AiGenerator';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a0ca3',
    },
    secondary: {
      main: '#f72585',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
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
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/designs/:id" element={<DesignDetail />} />
                <Route path="/users/:id" element={<UserProfile />} />
                
                <Route element={<PrivateRoute />}>
                  <Route path="/designs/create" element={<CreateDesign />} />
                  <Route path="/designs/edit/:id" element={<EditDesign />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/evaluation/:id" element={<EvaluationPage />} />
                  <Route path="/ai-generator" element={<AiGenerator />} />
                </Route>
                
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </Router>
          </NotificationProvider>
        </DesignProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
