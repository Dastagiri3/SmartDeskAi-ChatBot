import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SubmitTicket } from './pages/SubmitTicket';
import { TicketDetail } from './pages/TicketDetail';
import { AdminPanel } from './pages/AdminPanel';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#334155',
                border: '1px solid #e2e8f0',
              },
              success: {
                iconTheme: {
                  primary: '#1D9E75',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E24B4A',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-ticket"
              element={
                <ProtectedRoute>
                  <SubmitTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket/:id"
              element={
                <ProtectedRoute>
                  <TicketDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
