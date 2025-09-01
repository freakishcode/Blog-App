// routes/AppRoutes.jsx
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Home = lazy(() => import("../Pages/Home"));
const Create = lazy(() => import("../Pages/Create"));
const Update = lazy(() => import("../Pages/Update"));
const Read = lazy(() => import("../Pages/Read"));
const Login = lazy(() => import("../Pages/Auth/Login"));
const NotFound = lazy(() => import("../Pages/NotFound/NotFound"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route index element={<Home />} />

      {/* Protected */}
      <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
      <Route path="/update/:id" element={<ProtectedRoute><Update /></ProtectedRoute>} />
      <Route path="/read/:id" element={<ProtectedRoute><Read /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;


// App.jsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import "./App.css";
import Preloader from "./UI/PageLoading-Animation/LoadingAnimation";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const ErrorFallback = () => (
  <h2 className="ErrorBoundary">
    An error occurred in one of your components.
  </h2>
);

function App() {
  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<Preloader />}>
                <AppRoutes />
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
