
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import JobsPage from "./pages/JobsPage";
import CandidatesPage from "./pages/CandidatesPage";
import EmployeesPage from "./pages/EmployeesPage";
import ScreenTrackerPage from "./pages/ScreenTrackerPage";
import ReportsPage from "./pages/ReportsPage";
import OnboardTrackerPage from "./pages/OnboardTrackerPage";
import InterviewsPage from "./pages/InterviewsPage";
import InterviewReportsPage from "./pages/InterviewReportsPage";
import NotFound from "./pages/NotFound";
import { supabase } from "./services/supabase";
import { RBACProvider } from "./context/RBACContext";

// Role Management Pages
import RolesPage from "./pages/RolesPage";
import CreateRolePage from "./pages/CreateRolePage";
import EditRolePage from "./pages/EditRolePage";

// User Management Pages
import UsersPage from "./pages/UsersPage";
import CreateUserPage from "./pages/CreateUserPage";
import EditUserPage from "./pages/EditUserPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly initialized
    const checkSupabase = async () => {
      try {
        // Make a simple query to test the connection
        await supabase.from('jobs').select('count', { count: 'exact', head: true });
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Supabase initialization error:', error);
        toast({
          title: "Database Connection Error",
          description: "Please check your Supabase configuration.",
          variant: "destructive",
        });
      }
    };

    checkSupabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RBACProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/clients"
                element={
                  <Layout>
                    <ClientsPage />
                  </Layout>
                }
              />
              <Route
                path="/jobs"
                element={
                  <Layout>
                    <JobsPage />
                  </Layout>
                }
              />
              <Route
                path="/candidates"
                element={
                  <Layout>
                    <CandidatesPage />
                  </Layout>
                }
              />
              <Route
                path="/employees"
                element={
                  <Layout>
                    <EmployeesPage />
                  </Layout>
                }
              />
              <Route
                path="/interviews"
                element={
                  <Layout>
                    <InterviewsPage />
                  </Layout>
                }
              />
              <Route
                path="/interview-reports"
                element={
                  <Layout>
                    <InterviewReportsPage />
                  </Layout>
                }
              />
              <Route
                path="/screen-tracker"
                element={
                  <Layout>
                    <ScreenTrackerPage />
                  </Layout>
                }
              />
              <Route
                path="/reports"
                element={
                  <Layout>
                    <ReportsPage />
                  </Layout>
                }
              />
              <Route
                path="/onboard-tracker"
                element={
                  <Layout>
                    <OnboardTrackerPage />
                  </Layout>
                }
              />
              {/* Role Management Routes */}
              <Route
                path="/roles"
                element={
                  <Layout>
                    <RolesPage />
                  </Layout>
                }
              />
              <Route
                path="/roles/create"
                element={
                  <Layout>
                    <CreateRolePage />
                  </Layout>
                }
              />
              <Route
                path="/roles/edit/:id"
                element={
                  <Layout>
                    <EditRolePage />
                  </Layout>
                }
              />
              
              {/* User Management Routes */}
              <Route
                path="/users"
                element={
                  <Layout>
                    <UsersPage />
                  </Layout>
                }
              />
              <Route
                path="/users/create"
                element={
                  <Layout>
                    <CreateUserPage />
                  </Layout>
                }
              />
              <Route
                path="/users/edit/:id"
                element={
                  <Layout>
                    <EditUserPage />
                  </Layout>
                }
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </RBACProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
