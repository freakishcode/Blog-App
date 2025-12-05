import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SnackbarToast({
  open,
  severity = "success",
  message = "",
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
