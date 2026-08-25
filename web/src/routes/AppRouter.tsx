import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { PropertySelectionPage } from "../features/property/pages/PropertySelectionPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { CropsPage } from "../features/crop/pages/CropsPage";
import { CulturesPage } from "../features/culture/pages/CulturesPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { MainLayout } from "../components/layout/MainLayout";
import { DashboardLayout } from "../components/layout/DashboardLayout";
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


      <Route
        path="/:slug"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="crops" element={<CropsPage />} />
        <Route path="cultures" element={<CulturesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
