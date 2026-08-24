import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { PropertySelectionPage } from "../features/property/pages/PropertySelectionPage";
import { MainLayout } from "../components/layout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/properties" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertySelectionPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
