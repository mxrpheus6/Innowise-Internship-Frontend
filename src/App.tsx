import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import PaymentsPage from './pages/PaymentsPage';
import OrdersPage from './pages/OrdersPage';
import { ROUTES } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarketplacePage from './pages/MarketplacePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
            <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
            <Route path={ROUTES.MARKETPLACE} element={<MarketplacePage />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.PROFILE} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;