import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { sendComplaint, callCloudFunction } from "../lib/firebase";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Enter at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  subject: yup
    .string()
    .trim()
    .min(3, "Subject too short")
    .required("Subject is required"),
  message: yup
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation(
    async (payload) => {
      // store in RTDB
      const key = await sendComplaint(payload);
      // optional: call cloud function to send email (if configured)
      try {
        await callCloudFunction({
          ...payload,
          dbKey: key,
          notifyTo: "ajibolabakare@gmail.com",
        });
      } catch {
        // ignore cloud fn errors here (DB saved)
      }
      return key;
    },
    {
      onSuccess: () => {
        reset();
      },
    }
  );

  const [snack, setSnack] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
      setSnack({
        open: true,
        severity: "success",
        message: "Complaint submitted. Thank you.",
      });
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        message: err?.message || "Failed to submit complaint.",
      });
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <Paper elevation={6} className='max-w-3xl mx-auto p-6 md:p-10 rounded-xl'>
        <Typography variant='h5' className='font-bold mb-4'>
          Contact Me — Submit a Complaint
        </Typography>

        {/* top validation summary */}
        {Object.keys(errors).length > 0 && (
          <div className='mb-4'>
            <Alert severity='error'>
              <ul className='list-disc pl-5 m-0'>
                {Object.values(errors).map((e, i) => (
                  <li key={i}>{e.message}</li>
                ))}
              </ul>
            </Alert>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid grid-cols-1 gap-4'
        >
          <TextField
            label='Your name'
            variant='outlined'
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label='Your email'
            variant='outlined'
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label='Subject'
            variant='outlined'
            fullWidth
            {...register("subject")}
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />

          <TextField
            label='Message'
            variant='outlined'
            fullWidth
            multiline
            rows={6}
            {...register("message")}
            error={!!errors.message}
            helperText={errors.message?.message}
          />

          <div className='flex items-center gap-3'>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={mutation.isLoading}
              startIcon={
                mutation.isLoading ? <CircularProgress size={18} /> : null
              }
            >
              {mutation.isLoading ? "Sending..." : "Send Complaint"}
            </Button>

            <Button
              type='button'
              variant='outlined'
              color='secondary'
              onClick={() => reset()}
            >
              Reset
            </Button>

            <Typography variant='body2' className='text-gray-500 ml-auto'>
              Your complaint will be saved to backend and processed.
            </Typography>
          </div>
        </form>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
