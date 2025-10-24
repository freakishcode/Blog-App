import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ADMIN_FIREBASE_URL } from "../../../data/BaseURL";

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

import HowToRegIcon from "@mui/icons-material/HowToReg";

// Auth Form with smooth animated transition between Login and Register
export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const validate = () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (mode === "register") {
      if (!form.confirm) e.confirm = "Confirm password";
      else if (form.confirm !== form.password)
        e.confirm = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setMessage(null);
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(ADMIN_FIREBASE_URL, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "Registered successfully." });
      setForm({ name: "", email: "", password: "", confirm: "" });
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message || "Registration failed" });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.get(ADMIN_FIREBASE_URL);
      const users = res.data ? Object.values(res.data) : [];
      const found = users.find(
        (u) =>
          u.email?.toLowerCase() === form.email.toLowerCase() &&
          u.password === form.password
      );
      if (!found) throw new Error("Invalid credentials");
      localStorage.setItem(
        "_demo_user",
        JSON.stringify({ email: found.email, name: found.name })
      );
      return found;
    },
    onSuccess: (user) => {
      setMessage({
        type: "success",
        text: `Welcome back, ${user.name || user.email}`,
      });
      setForm({ name: "", email: "", password: "", confirm: "" });
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message || "Login failed" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setMessage(null);
    mode === "register" ? registerMutation.mutate() : loginMutation.mutate();
  };

  const loading = registerMutation.isPending || loginMutation.isPending;

  const toggleMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setMessage(null);
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className='flex justify-center items-center'>
      <Paper className='relative overflow-hidden'>
        <div
          className='flex w-[200%] transition-transform duration-700 ease-in-out p-2.5'
          style={{
            transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)",
          }}
        >
          {/* Login Form */}
          <motion.div
            key='login-form'
            className='w-1/2 p-10  flex flex-col justify-center gap-1.5'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
              <HowToRegIcon />
            </Avatar>

            <Typography variant='h5' gutterBottom textAlign='center'>
              Login to Your Account
            </Typography>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                {/* Email */}
                <TextField
                  label='Email'
                  type='email'
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <label className='block text-sm'>Email</label>
                <input
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:ring-indigo-400 ${
                    errors.email ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder='you@example.com'
                />
                {errors.email && (
                  <p className='text-red-400 text-xs'>{errors.email}</p>
                )}
              </div>
              <div>
                <label className='block text-sm'>Password</label>
                <input
                  name='password'
                  type='password'
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:ring-indigo-400 ${
                    errors.password ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder='********'
                />
                {errors.password && (
                  <p className='text-red-400 text-xs'>{errors.password}</p>
                )}
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold mt-4 transition'
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className='text-sm mt-6 text-slate-300'>
              Don’t have an account?{" "}
              <button
                onClick={() => toggleMode("register")}
                className='underline'
              >
                Create one
              </button>
            </p>
          </motion.div>

          {/* Register Form */}
          <motion.div
            key='register-form'
            className='w-1/2 p-10 text-white flex flex-col justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className='text-3xl font-semibold mb-4'>Create Account</h2>
            <p className='text-sm text-slate-300 mb-6'>
              Register to start managing your dashboard
            </p>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm'>Full Name</label>
                <input
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:ring-indigo-400 ${
                    errors.name ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder='Jane Doe'
                />
                {errors.name && (
                  <p className='text-red-400 text-xs'>{errors.name}</p>
                )}
              </div>
              <div>
                <label className='block text-sm'>Email</label>
                <input
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:ring-indigo-400 ${
                    errors.email ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder='you@example.com'
                />
                {errors.email && (
                  <p className='text-red-400 text-xs'>{errors.email}</p>
                )}
              </div>
              <div>
                <label className='block text-sm'>Password</label>
                <input
                  name='password'
                  type='password'
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:ring-indigo-400 ${
                    errors.password ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder='********'
                />
                {errors.password && (
                  <p className='text-red-400 text-xs'>{errors.password}</p>
                )}
              </div>
              <div>
                <label className='block text-sm'>Confirm Password</label>
                <input
                  name='confirm'
                  type='password'
                  value={form.confirm}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 rounded-md bg-white/10 border focus:ring-2 focus:ring-indigo-400 ${
                    errors.confirm ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder='Repeat password'
                />
                {errors.confirm && (
                  <p className='text-red-400 text-xs'>{errors.confirm}</p>
                )}
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold mt-4 transition'
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <p className='text-sm mt-6 text-slate-300'>
              Already have an account?{" "}
              <button onClick={() => toggleMode("login")} className='underline'>
                Sign in
              </button>
            </p>
          </motion.div>
        </div>

        {/* Message Box */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] text-center p-3 rounded-md ${
              message.type === "success" ? "bg-green-600/70" : "bg-red-600/70"
            } text-white text-sm`}
          >
            {message.text}
          </motion.div>
        )}
      </Paper>
    </div>
  );
}
