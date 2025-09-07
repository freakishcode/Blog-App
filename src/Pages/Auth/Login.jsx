import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../validation/authValidation";
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
import { useToast } from "../../UI/ToastMessage/ToastContext";

// ✅ Import API
import { fetchAdminByEmail } from "../../api/RegLog_api";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  // Watch email input
  const email = watch("email");

  // ✅ Fetch admin by email using extracted queryFn
  const {
    data: admins = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["admin", email],
    queryFn: () => fetchAdminByEmail(email),
    enabled: !!email, // don’t run until email is filled
  });

  // ✅ Handle form submit
  const onSubmit = (formData) => {
    const adminFound =
      admins.length > 0 &&
      admins.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.password === formData.password
      );

    if (adminFound) {
      toast?.open("✅ Login successful!");
      navigate("/");
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
          {isError && (
            <p style={{ textAlign: "center", color: "red" }}>
              Unable to Login due to: {error.message}
            </p>
          )}

          {/* Email */}
          <TextField
            label='Email'
            type='email'
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
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

          {/* Submit */}
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
