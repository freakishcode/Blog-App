import "./Add.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../UI/ToastMessage/ToastContext";
import { createPost } from "../../api/Crud_api";

// MUI
import {
  Stack,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

function Add() {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Memoized validation schema
  const schema = useMemo(
    () =>
      yup.object({
        full_name: yup.string().required("Your full name is required"),
        username: yup
          .string()
          .min(3, "Username must be at least 3 characters")
          .required("Username is required"),
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        gender: yup.string().required("Gender is required"),
        phone: yup
          .string()
          .matches(/^\d{11}$/, "Phone No must be 11 digits")
          .required("Phone number is required"),
        password: yup
          .string()
          .min(5, "Password must be at least 5 characters")
          .required("Password is required"),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { gender: "" },
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast?.open("✅ Registration successful!");
      navigate("/About");
    },
    onError: (err) => {
      console.error("❌ Error creating user:", err);
      toast?.open("❌ Registration failed, please try again");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  const formFields = [
    {
      name: "full_name",
      label: "Full Name",
      icon: <PersonIcon />,
      type: "text",
    },
    {
      name: "username",
      label: "Username",
      icon: <PersonIcon />,
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      icon: <EmailIcon />,
      type: "email",
    },
  ];

  return (
    <Paper className='container p-6' elevation={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant='h5' align='center' gutterBottom>
          ✨ Registration ✨
        </Typography>

        <div className='line mb-4'></div>

        {/* ✅ Responsive layout with Tailwind */}
        <div className='flex flex-col md:flex-row gap-4'>
          {/* LEFT COLUMN */}
          <Stack spacing={2} className='flex-1'>
            {formFields.map(({ name, label, icon, type }) => (
              <TextField
                key={name}
                label={label}
                type={type}
                fullWidth
                error={!!errors[name]}
                helperText={errors[name]?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>{icon}</InputAdornment>
                  ),
                }}
                {...register(name)}
              />
            ))}
          </Stack>

          {/* RIGHT COLUMN */}
          <Stack spacing={2} className='flex-1'>
            <TextField
              label='Select Gender'
              select
              fullWidth
              defaultValue=''
              error={!!errors.gender}
              helperText={errors.gender?.message}
              {...register("gender")}
            >
              <MenuItem value=''>-- Select --</MenuItem>
              <MenuItem value='Male'>Male</MenuItem>
              <MenuItem value='Female'>Female</MenuItem>
            </TextField>

            <TextField
              label='Phone No'
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>+234</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
              {...register("phone")}
            />

            <TextField
              label='Password'
              type={showPassword ? "text" : "password"}
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete='new-password'
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
              {...register("password")}
            />
          </Stack>
        </div>

        {/* Buttons */}
        <Stack spacing={2} mt={3}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={mutation.isLoading}
            endIcon={
              !mutation.isLoading && (
                <CheckCircleOutlineIcon style={{ color: "white" }} />
              )
            }
          >
            {mutation.isLoading ? (
              <CircularProgress size={22} color='inherit' />
            ) : (
              "Register"
            )}
          </Button>

          <Button
            variant='text'
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none" }}
          >
            Already have an account? Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default Add;
