import React from "react";
import { EditableContentProvider } from "./contexts/EditableContentContext";
import {
  RouterProvider,
  useRouter,
} from "./contexts/RouterContext";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import "./styles/globals.css";

// Componente principal que maneja el routing
const AppContent: React.FC = () => {
  const { currentRoute } = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentRoute === "landing" && <LandingPage />}
      {currentRoute === "admin" && <AdminPage />}
    </div>
  );
};

export default function App() {
  return (
    <EditableContentProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </EditableContentProvider>
  );
}