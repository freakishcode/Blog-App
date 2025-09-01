import { useEffect, useRef } from "react";

// timer component to close Toast Message
function useTimeOut(CallbackFunction) {
  const savedCallback = useRef(CallbackFunction);

  useEffect(() => {
    savedCallback.current = CallbackFunction;
  }, [CallbackFunction]);

  useEffect(() => {
    const functionId = setTimeout(() => savedCallback.current(), 8000);

    return () => clearTimeout(functionId);
  }, []);
}

// re-usable Toast message
export default function ToastMessage(props) {
  const { message, close } = props;

  // setting a timer for the toast message if not closed by the user
  useTimeOut(() => {
    // closing toast message after 3sec
    close();
  });

  return (
    <div className='toast'>
      <p>{message}</p>
      <button className='close-button' onClick={close}>
        {"\u274C"}
      </button>
    </div>
  );
}
