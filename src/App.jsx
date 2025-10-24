import "./App.css";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// UI Components
import Preloader from "./UI/PageLoading-Animation/LoadingAnimation";
import { ToastProvider } from "./UI/ToastMessage/ToastProvider";

// Error Fallback Component
import { ErrorFallback } from "./UI/ErrorFallback";

// TODO: My layouts : TO store Links and NavLinks
import RootLayout from "./Layout/RootLayout";

// Lazy-loaded Pages
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Help = lazy(() => import("./Pages/Help"));
const Create = lazy(() => import("./Pages/Create"));
const Update = lazy(() => import("./Pages/Update"));
const Read = lazy(() => import("./Pages/Read"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const RegisterAndLogin = lazy(() =>
  import("./Pages/Auth/LoginAndRegisterPage.jsx")
);
const Register = lazy(() => import("./Pages/Auth/Register"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

// Query Client instance (outside component to avoid re-creation)
const queryClient = new QueryClient();

// Router setup
export const BrowserRouters = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='registerandlogin' element={<RegisterAndLogin />} />

      <Route path='about' element={<About />} />
      <Route path='help' element={<Help />} />

      <Route path='create' element={<Create />} />
      <Route path='update/:id' element={<Update />} />
      <Route path='read/:id' element={<Read />} />

      {/* Error page Route if None of the above page is Not found */}
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Preloader />}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <RouterProvider router={BrowserRouters} />
          </ToastProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
