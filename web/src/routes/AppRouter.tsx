import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<h1> Página Inicial</h1>}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
    </Routes>
  );
}
