import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// TODO: using REACT ROUTER (External library)
import { BrowserRouter } from "react-router-dom";

// React Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client instance
const queryClient = new QueryClient();

// TODO: CUSTOM COMPONENT: Toast will be available through out the app
import { ToastProvider } from "./UI/ToastMessage/ToastProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
