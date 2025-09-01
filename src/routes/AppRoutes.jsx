// routes/AppRoutes.jsx
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded Pages
const Home = lazy(() => import("../Pages/Home"));
const Create = lazy(() => import("../Pages/Create"));
const Update = lazy(() => import("../Pages/Update"));
const Read = lazy(() => import("../Pages/Read"));

const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));

const NotFound = lazy(() => import("../Pages/NotFound/NotFound"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route index element={<Home />} />

      {/* Protected Routes */}
      <Route path='/create' element={<Create />} />
      <Route path='/update/:id' element={<Update />} />
      <Route path='/read/:id' element={<Read />} />

      {/* Catch-all */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
