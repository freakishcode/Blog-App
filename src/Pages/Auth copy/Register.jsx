// Pages/Auth/Register.jsx
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postForm } from "../../api/RegLog_api";

// React Hook Form + Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../validation/authValidation";

// Material UI
import {
  Box,
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Modal,
  Fade,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import HowToRegIcon from "@mui/icons-material/HowToReg";

// TODO: Accessing Toast context message
import { useToast } from "../../UI/ToastMessage/ToastContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  minWidth: 400,
  maxWidth: "95vw",
  outline: "none",
  transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
};

const Register = ({ open, setOpen, onClose }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      toast?.open("✅ Registration successful!");
      navigate("/About"); // Redirect to login after success
      onClose();
    },
    onError: () => {
      toast?.open("❌ Registration failed, please try again");
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
      <Fade in={open}>
        <Paper elevation={3} sx={modalStyle}>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
            <HowToRegIcon />
          </Avatar>

          <Typography variant='h5' gutterBottom textAlign={"center"}>
            Create a New Account
          </Typography>

          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label='Full Name'
              fullWidth
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.name?.message}
            />

            <TextField
              label='Email'
              type='email'
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label='Password'
              type='password'
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={mutation.isLoading}
              sx={{ mt: 2 }}
            >
              {mutation.isLoading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                "Register"
              )}
            </Button>

            <Button
              variant='text'
              onClick={() => {
                onClose();
                navigate("/login");
              }}
            >
              Already have an account? Login
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default Register;
