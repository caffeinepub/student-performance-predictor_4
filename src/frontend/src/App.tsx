import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UserRole } from "./backend.d";
import AppLayout from "./components/AppLayout";
import SetupNameDialog from "./components/SetupNameDialog";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const [showSetupName, setShowSetupName] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (!identity || !actor || isFetching) return;
    setLoadingRole(true);
    Promise.all([actor.getCallerUserRole(), actor.getCallerUserProfile()])
      .then(([userRole, profile]) => {
        setRole(userRole);
        if (!profile || !profile.name) {
          setShowSetupName(true);
        }
        setProfileChecked(true);
      })
      .finally(() => setLoadingRole(false));
  }, [identity, actor, isFetching]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  if (loadingRole || !profileChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = role === UserRole.admin;

  return (
    <AppLayout isAdmin={isAdmin}>
      {showSetupName && (
        <SetupNameDialog
          open={showSetupName}
          onClose={() => setShowSetupName(false)}
        />
      )}
      {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
