import "./Add.css";

// TODO: Using AXIOS LIBRARY
import axios from "axios";

// ✅ React Query import
import { useMutation, useQueryClient } from "@tanstack/react-query";

// TODO: REACT HOOK FORM (external library) for form control
import { useForm } from "react-hook-form";

// external library for form validation for REACT HOOK FORM
import * as yup from "yup";

//Medium to connect both yup & REACT HOOK FORM libraries
import { yupResolver } from "@hookform/resolvers/yup";

// TODO: React router (external library)
import { Link, useNavigate } from "react-router-dom";

// TODO: Accessing Toast context message
import { useToast } from "../../UI/ToastMessage/ToastContext";

// TODO: Material UI library
import {
  Box,
  Stack,
  Avatar,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

// MATERIAL UI ICONS
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import HowToRegIcon from "@mui/icons-material/HowToReg";

// TODO: DATA BASE JSON
import { BASE_URL } from "../../../data/BaseURL";

function Add() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigateBack = useNavigate();

  // form validation from yup library
  const schema = yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email format").required(),
    gender: yup.string().required("Gender is required"),
    phone: yup
      .string()
      .required("Phone No is required")
      .matches(/^\d{11}$/, "Phone No must be 11 digits"),
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
    mutationFn: (newUser) => axios.post(BASE_URL, newUser),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Refresh user list
      toast?.open("User added successfully");
      navigateBack("/"); // Redirect to home
    },
    onError: (err) => {
      console.error("Error creating user:", err);
      toast?.open("Failed to add user");
    },
  });

  // ✅ Replace direct axios with mutation
  const SubmitForm = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit(SubmitForm)}>
        <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
          <HowToRegIcon />
        </Avatar>
        <h1>Register User</h1>
        <div className='line'></div>

        <Stack spacing={3} direction='column'>
          <Stack spacing={4} direction='column'>
            <TextField
              label='Full Name'
              size='small'
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

            {/* Email */}
            <TextField
              label='Email'
              size='small'
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

            {/* Gender */}
            <Box width='100%'>
              <TextField
                label='Select Gender'
                size='small'
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
              size='small'
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
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Link to='/'>
              <Button
                variant='contained'
                color='info'
                size='small'
                endIcon={<KeyboardReturnIcon />}
              >
                Back
              </Button>
            </Link>

            {/* Disable button while submitting */}
            <Button
              type='submit'
              variant='contained'
              color='success'
              size='small'
              disabled={mutation.isLoading}
              endIcon={<CheckCircleOutlineIcon style={{ color: "white" }} />}
            >
              {mutation.isLoading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Stack>
      </form>
    </div>
  );
}

export default Add;
