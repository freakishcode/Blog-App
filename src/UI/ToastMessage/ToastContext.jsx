import { createContext, useContext } from "react";

// created an context
export const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);
