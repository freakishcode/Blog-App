import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

// Material UI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import RegisterModal from "../Pages/Auth/Register";

function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const isMobile = useMediaQuery("(min-width:20rem) and (max-width:64rem)");

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/About" },
    { label: "Help", to: "/Help" },
    // { label: "Post a Blog +", to: "/create" },
  ];

  return (
    <>
      <AppBar position='static' color='default' elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant='h6' fontWeight='bold'>
            Blog App
          </Typography>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 45,
              }}
            >
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
                  to='/registerandlogin'
                  variant='contained'
                  color='primary'
                >
                  Register/Login
                </Button>

                <Button
                  component={Link}
                  to='/create'
                  variant='contained'
                  color='primary'
                >
                  Register
                </Button>

                <Button
                  component={Link}
                  to='/login'
                  variant='contained'
                  color='primary'
                >
                  Login
                </Button>
              </Stack>
            </Box>
          )}

          {/* Mobile Nav Hamburger */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                edge='end'
                color='primary'
                aria-label='menu'
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon fontSize='large' />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 260, bgcolor: "background.default" },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center all drawer items horizontally
            gap: 1,
          }}
        >
          {navLinks.map((link) => (
            <ListItem
              key={link.to}
              disablePadding
              sx={{ width: "100%", justifyContent: "center" }}
            >
              <ListItemButton
                component={NavLink}
                to={link.to}
                onClick={handleDrawerToggle}
                sx={{
                  justifyContent: "center",
                  "&.active .MuiListItemText-primary": {
                    color: "#1976d2",
                    fontWeight: 700,
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  sx={{ textAlign: "center" }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem
            disablePadding
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <ListItemButton
              component={NavLink}
              to={"./login"}
              onClick={handleDrawerToggle}
              sx={{
                justifyContent: "center",
                "&.active .MuiListItemText-primary": {
                  color: "#1976d2",
                  fontWeight: 700,
                },
              }}
            >
              <ListItemText primary='Login' sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <ListItemButton
              component={NavLink}
              to={"./create"}
              onClick={handleDrawerToggle}
              sx={{
                justifyContent: "center",
                "&.active .MuiListItemText-primary": {
                  color: "#1976d2",
                  fontWeight: 700,
                },
              }}
            >
              <ListItemText primary='Register' sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <main>
        <RegisterModal
          open={openRegister}
          onClose={() => setOpenRegister(false)}
          setOpen={setOpenRegister}
        />

        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
