import "./Add.css";
import { useState } from "react";

// TODO: React router (external library)
import { Link, useNavigate } from "react-router-dom";
// ✅ React Query import
import { useMutation, useQueryClient } from "@tanstack/react-query";

// TODO: React Hook Form + Yup (external library)
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// TODO: Accessing Toast context message
import { useToast } from "../../UI/ToastMessage/ToastContext";

import { createPost } from "../../api/Crud_api";

// TODO: Material UI library
import {
  Box,
  Stack,
  // Avatar,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";

// MATERIAL UI ICONS
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
// import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Add() {
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const queryClient = useQueryClient();
  const navigateBack = useNavigate();

  // form validation from yup library
  const schema = yup.object().shape({
    full_name: yup.string().required("Your Full name is required"),
    username: yup
      .string()
      .min(3, "userName must be at least 3 characters")
      .required("Username is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    gender: yup.string().required("Gender is required"),
    phone: yup
      .string()
      .required("Phone No is required")
      .matches(/^\d{11}$/, "Phone No must be 11 digits"),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      gender: "", // 👈 ensure controlled value
    },
  });

  // ✅ Mutation for creating user
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Refresh user list
      toast?.open("✅ Registration successful!");
      navigateBack("/About"); // Redirect to home
    },
    onError: (err) => {
      console.error("Error creating user:", err);
      toast?.open("❌ Registration failed, please try again");
    },
  });

  // ✅ Replace direct axios with mutation
  const SubmitForm = (data) => {
    mutation.mutate(data);
  };

  return (
    <Paper className='container'>
      <form onSubmit={handleSubmit(SubmitForm)}>
        <header>
          {/* <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
            <HowToRegIcon />
          </Avatar> */}

          <Typography variant='h5' gutterBottom textAlign={"center"}>
            ✨ Registration ✨
          </Typography>
        </header>

        <div className='line'></div>

        <div className='flex gap-4'>
          <Stack spacing={2}>
            {/* Full Name */}
            <TextField
              label='Full Name'
              fullWidth
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              {...register("full_name")}
            />

            {/* username */}
            <TextField
              label='Username'
              fullWidth
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              {...register("username")}
            />

            {/* Email */}
            <TextField
              label='Email'
              fullWidth
              type='email'
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              {...register("email")}
            />
          </Stack>

          <Stack spacing={2}>
            {/* Gender */}
            <Box width='100%'>
              <TextField
                label='Select Gender'
                fullWidth
                select
                defaultValue=''
                error={!!errors.gender}
                helperText={errors.gender?.message}
                {...register("gender")}
              >
                <MenuItem value=''>-- Select --</MenuItem>
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
              </TextField>
            </Box>
            <TextField
              label='Phone No'
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <PhoneIcon />
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position='start'>+234</InputAdornment>
                ),
              }}
              {...register("phone")}
            />

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
          </Stack>
        </div>

        <Stack spacing={2} direction='column' marginTop='1rem'>
          {/* Disable button while submitting */}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={mutation.isLoading}
            endIcon={<CheckCircleOutlineIcon style={{ color: "white" }} />}
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
              navigateBack("/login");
            }}
          >
            Already have an account? Login
          </Button>
        </Stack>

        <p className='text-center'>or login with social platforms</p>

        <div className='social-icons'>
          <a href='#' className='google'>
            <i className='bx bxl-google'></i>
          </a>
          <a href='#' className='facebook'>
            <i className='bx bxl-facebook'></i>
          </a>
          <a href='#' className='github'>
            <i className='bx bxl-github'></i>
          </a>
          <a href='#' className='linkedin'>
            <i className='bx bxl-linkedin'></i>
          </a>
        </div>
      </form>
    </Paper>
  );
}

export default Add;
