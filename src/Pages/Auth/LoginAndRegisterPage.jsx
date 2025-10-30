import "./LoginAndRegisterPage.css";
import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postForm } from "../../api/RegLog_api";
import { useToast } from "../../UI/ToastMessage/ToastContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function LoginAndRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // --- dynamic validation schema ---
  const schema = useMemo(() => {
    const base = {
      username: yup
        .string()
        .trim()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    };

    if (isLogin) {
      return yup.object().shape(base);
    }

    // register requires email as well
    return yup.object().shape({
      ...base,
      email: yup
        .string()
        .trim()
        .required("Email is required")
        .email("Enter a valid email"),
    });
  }, [isLogin]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      toast?.open("✅ Operation successful!");
      navigate("/About");
    },
    onError: () => {
      toast?.open("❌ Operation failed, please try again.");
    },
  });

  // submit using react-hook-form data
  const onSubmit = (data) => {
    mutation.mutate({
      mode: isLogin ? "login" : "register",
      ...data,
    });
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    reset({ username: "", email: "", password: "" });
  };

  return (
    <div className='UserForm'>
      <div
        className={`containerForm ${isLogin ? "show-login" : "show-register"}`}
      >
        <div className='form-box'>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h1>{isLogin ? "Login" : "Registration"}</h1>

            {/* Username */}
            <div className='input-box'>
              <input
                type='text'
                {...register("username")}
                placeholder='Username'
                aria-invalid={!!errors.username}
              />
              <i className='bx bxs-user'></i>
            </div>
            {errors.username && (
              <p className='form-error'>{errors.username.message}</p>
            )}

            {/* Email only for Register */}
            {!isLogin && (
              <>
                <div className='input-box'>
                  <input
                    type='email'
                    {...register("email")}
                    placeholder='Email'
                    aria-invalid={!!errors.email}
                  />
                  <i className='bx bxs-envelope'></i>
                </div>
                {errors.email && (
                  <p className='form-error'>{errors.email.message}</p>
                )}
              </>
            )}

            {/* Password */}
            <div className='input-box'>
              <input
                type='password'
                {...register("password")}
                placeholder='Password'
                aria-invalid={!!errors.password}
              />
              <i className='bx bxs-lock-alt'></i>
            </div>
            {errors.password && (
              <p className='form-error'>{errors.password.message}</p>
            )}

            {/* Forgot password link (Login only) */}
            {isLogin && (
              <div className='forgot-link'>
                <a href='#'>Forgot password?</a>
              </div>
            )}

            <button type='submit' className='btn' disabled={isSubmitting}>
              {isLogin ? "Login" : "Register"}
            </button>

            <p>or {isLogin ? "login" : "register"} with social platforms</p>

            {isLogin && (
              <button
                type='submit'
                className='btn social-icons'
                disabled={isSubmitting}
              >
                Login with{" "}
                <span href='#' className='google'>
                  <i className='bx bxl-google'></i>
                </span>
              </button>
            )}
          </form>
        </div>

        <div className='toggle-box'>
          {isLogin ? (
            <div className='toggle-panel'>
              <h1>Hello, Welcome</h1>
              <p>Don't have an account?</p>
              <button className='btn register-btn' onClick={toggleForm}>
                Register
              </button>
            </div>
          ) : (
            <div className='toggle-panel'>
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button className='btn login-btn' onClick={toggleForm}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginAndRegisterPage;
