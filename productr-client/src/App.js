import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute><ProductsPage /></ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute><AddProductPage /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;