import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "../Context/Context";
import useDebounce from "../Hooks/useDebounce";
import TableResult from "../components/DashboardResult/TableResult";

import { ReadUsers } from "../api/Crud_api";

// Material UI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Container,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/About" },
  { label: "Help", to: "/Help" },
];

function Home() {
  // ✅ React Query handles fetching, caching, and error states
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: ReadUsers,
  });

  // Debounce search
  const debouncedSearch = useDebounce(users, 1000);

  return (
    <>
      {/* ✅ Navigation */}
      <AppBar position='static' color='default' elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant='h6' fontWeight='bold'>
            CRUD App
          </Typography>

          <Stack direction='row' spacing={3}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#1976d2" : "#333",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "1.1rem",
                  borderBottom: isActive ? "2px solid #1976d2" : "none",
                  padding: "6px 0",
                  transition: "color 0.2s",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </Stack>

          <Stack direction='row' spacing={2}>
            <Button
              component={Link}
              to='/login'
              variant='contained'
              color='primary'
            >
              Login
            </Button>
            <Button
              component={Link}
              to='/register'
              variant='contained'
              color='primary'
            >
              Register
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ✅ Page Content */}
      <Container sx={{ mt: 4 }}>
        <Box textAlign='center' mb={3}>
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            C.R.U.D Project
          </Typography>
          <Typography variant='subtitle1'>
            Records: {users.length} users
          </Typography>
        </Box>

        {/* Create/Add button */}
        <Box textAlign='center' mb={3}>
          <Button
            component={Link}
            to='/create'
            variant='contained'
            color='success'
          >
            Create / Add +
          </Button>
        </Box>

        {/* ✅ Handle Loading */}
        {isLoading && (
          <Box textAlign='center' mt={5}>
            <CircularProgress />
          </Box>
        )}

        {/* ✅ Handle Error */}
        {isError && (
          <Box textAlign='center' mt={5}>
            <Alert severity='error'>
              Failed to fetch users: {error.message}
            </Alert>
          </Box>
        )}

        {/* ✅ Render Data */}
        {!isLoading && !isError && (
          <AppContext.Provider
            value={{
              data: users,
              DebounceSearchValue: debouncedSearch,
              setInputRecords: () => {}, // not needed since react-query manages data
            }}
          >
            <TableResult />
          </AppContext.Provider>
        )}
      </Container>
    </>
  );
}

export default Home;
