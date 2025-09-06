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
const ErrorFallback = () => (
  <h2 className='ErrorBoundary'>
    An error occurred in one of your components.
  </h2>
);

// Lazy-loaded Pages
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Create = lazy(() => import("./Pages/Create"));
const Update = lazy(() => import("./Pages/Update"));
const Read = lazy(() => import("./Pages/Read"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const Register = lazy(() => import("./Pages/Auth/Register"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

// Query Client instance (outside component to avoid re-creation)
const queryClient = new QueryClient();

// Router setup
export const BrowserRouters = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='about' element={<About />} />
      <Route path='create' element={<Create />} />
      <Route path='update/:id' element={<Update />} />
      <Route path='read/:id' element={<Read />} />
      <Route path='*' element={<NotFound />} />
    </>
  ),
  {
    basename: "/CRUD-React-PHP", // for GitHub Pages or subpath hosting
  }
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
