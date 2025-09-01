// App.jsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Styles
import "./App.css";

// UI Components
import Preloader from "./UI/PageLoading-Animation/LoadingAnimation";
import AppRoutes from "./routes/AppRoutes";

// Error Fallback Component
const ErrorFallback = () => (
  <h2 className='ErrorBoundary'>
    An error occurred in one of your components.
  </h2>
);

function App() {
  return (
    <div className='App'>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Preloader />}>
          <AppRoutes />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
