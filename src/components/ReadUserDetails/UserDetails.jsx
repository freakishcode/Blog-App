import "./UserDetails.css";
import { Link, useParams } from "react-router-dom";
import {
  Paper,
  Avatar,
  Stack,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  HowToReg as HowToRegIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  KeyboardReturn as KeyboardReturnIcon,
  Wc as GenderIcon,
} from "@mui/icons-material";

import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../../api/Crud_api";

function UserDetails() {
  const { id } = useParams();

  const {
    data: user,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // cache for 3 minutes
  });

  if (isLoading)
    return (
      <div className='loadingState'>
        <CircularProgress size={24} sx={{ color: "primary.main" }} />
        <p>Loading user details...</p>
      </div>
    );

  if (isError)
    return (
      <p className='error'>
        ⚠️ Error fetching user details:{" "}
        {error?.message || "Something went wrong"}
      </p>
    );

  if (!user) return <p className='error'>No user found with this ID.</p>;

  return (
    <Paper
      sx={{
        margin: "auto",
        mt: 6,
        p: 3,
        maxWidth: 420,
        borderRadius: 3,
        backgroundColor: "#f8f9fa",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
      elevation={4}
    >
      <Stack alignItems='center' spacing={1}>
        <Avatar sx={{ bgcolor: "secondary.main", width: 60, height: 60 }}>
          <HowToRegIcon fontSize='large' />
        </Avatar>
        <Typography variant='h5' fontWeight={600}>
          User Details
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5} sx={{ mb: 3, px: 1 }}>
        <UserInfo
          icon={<PersonIcon />}
          label='Full Name'
          value={user.full_name}
        />
        <UserInfo icon={<EmailIcon />} label='Email' value={user.email} />
        <UserInfo icon={<GenderIcon />} label='Gender' value={user.gender} />
        <UserInfo icon={<PhoneIcon />} label='Phone No' value={user.phone} />
      </Stack>

      <Stack direction='row' justifyContent='center' spacing={3}>
        <Link to='/' style={{ textDecoration: "none" }}>
          <Button
            variant='contained'
            color='error'
            size='small'
            startIcon={<KeyboardReturnIcon />}
          >
            Back
          </Button>
        </Link>

        <Link to={`/Update/${user.id}`} style={{ textDecoration: "none" }}>
          <Button
            variant='contained'
            color='info'
            size='small'
            endIcon={<CheckCircleOutlineIcon />}
          >
            Edit / Update
          </Button>
        </Link>
      </Stack>
    </Paper>
  );
}

function UserInfo({ icon, label, value }) {
  return (
    <Stack direction='row' alignItems='center' spacing={1.5}>
      {icon}
      <Typography variant='body1'>
        <strong>{label}:</strong> {value || "—"}
      </Typography>
    </Stack>
  );
}

export default UserDetails;
