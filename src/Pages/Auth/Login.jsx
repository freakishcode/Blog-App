// Pages/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Mock login API (replace with real backend endpoint later)
import { checkEmailExists } from "../../api/API";

// React Hook Form + Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../validation/authValidation";

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
  IconButton,
  InputAdornment,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import HowToRegIcon from "@mui/icons-material/HowToReg";

// ✅ Toast context
import { useToast } from "../../UI/ToastMessage/ToastContext";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  // ✅ Fetch users list with React Query
  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: checkEmailExists,
  });

  // ✅ Fixed: use form data from handleSubmit
  const onSubmit = (formData) => {
    const adminFound = admins.find(
      (u) =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        u.password === formData.password
    );

    if (adminFound) {
      toast?.open("✅ Login successful!");
      navigate("/"); // Redirect to homepage
    } else {
      toast?.open("❌ Invalid email or password");
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
          <HowToRegIcon />
        </Avatar>

        <Typography variant='h5' gutterBottom textAlign='center'>
          Login to Your Account
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* ✅ Email */}
          <TextField
            label='Email'
            type='email'
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* ✅ Password */}
          <TextField
            label='Password'
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* ✅ Submit */}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              "Login"
            )}
          </Button>

          <Button variant='text' onClick={() => navigate("/register")}>
            Don’t have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
