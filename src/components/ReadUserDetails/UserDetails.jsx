import "./UserDetails.css";

import { Link, useParams } from "react-router-dom";

// TODO: Material UI library
import { Paper, Avatar, Stack, Button } from "@mui/material";

// MATERIAL UI ICONS
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import { BASE_URL } from "../../../data/BaseURL";

// ✅ React Query + Axios
import { useQuery } from "@tanstack/react-query";

// API functions
import { fetchUserById } from "../../api/Crud_api";

function UserDetails() {
  // parameter to target user id
  const { id } = useParams();

  // ✅ Fetch single user with React Query
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // only run if id exists
  });

  if (isLoading)
    return <p className='loadingState '>Loading user details...</p>;
  if (isError)
    return (
      <p className='error'>Error fetching user details: {error.message}</p>
    );

  return (
    <Paper
      sx={{
        margin: "auto",
        marginTop: "4rem",
        padding: "1rem",
        width: "400px",
        height: "400px",
        background: "#eeee",
      }}
      elevation={4}
    >
      <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
        <HowToRegIcon />
      </Avatar>
      <h1>Details</h1>

      {/* A line drawn */}
      <div className='line'></div>

      <div className='user_details'>
        <strong>
          <PersonIcon />
          Full Name: {data.full_name}
        </strong>

        <strong>
          <EmailIcon />
          Email: {data.email}
        </strong>

        <strong>
          <PersonIcon />
          Gender: {data.gender}
        </strong>

        <strong>
          <PhoneIcon />
          Phone No: {data.phone}
        </strong>
      </div>

      <div className='btn_field'>
        <Stack direction='row' spacing={6}>
          {/* Back */}
          <Link to='/'>
            <Button
              variant='contained'
              color='error'
              size='small'
              startIcon={<KeyboardReturnIcon />}
            >
              Back
            </Button>
          </Link>

          {/* Edit / Update */}
          <Link to={`/Update/${data.id}`}>
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
      </div>
    </Paper>
  );
}

export default UserDetails;
