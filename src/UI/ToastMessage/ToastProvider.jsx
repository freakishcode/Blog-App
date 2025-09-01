import { useMemo, useState } from "react";
import "./ToastMessage.css";

// context
import { ToastContext } from "./ToastContext";

// actual Toast message component
import ToastMessage from "./ToastMessage";

export function ToastProvider(props) {
  const { children } = props;

  // state to store toast
  const [toasts, setToasts] = useState([]);

  //   functionality to open Toast
  function openToast(message) {
    const newToast = {
      id: Date.now(),
      message: message,
    };
    setToasts((previousToasts) => [...previousToasts, newToast]);
  }

  //   functionality to close Toast
  function closeToast(id) {
    setToasts((previousToasts) =>
      previousToasts.filter((toasts) => toasts.id !== id)
    );
  }

  // to cash the function
  const contextValue = useMemo(
    () => ({
      open: openToast,
      close: closeToast,
    }),
    []
  );

  return (
    <>
      <ToastContext.Provider value={contextValue}>
        {children}
        <div className='toasts-message'>
          {toasts &&
            toasts.map((toast) => {
              return (
                <ToastMessage
                  key={toast.id}
                  message={toast.message}
                  close={() => closeToast(toast.id)}
                />
              );
            })}
        </div>
      </ToastContext.Provider>
    </>
  );
}
