import { Route, Routes } from "react-router-dom";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<h1> Página Inicial</h1>}></Route>
    </Routes>
  );
}
