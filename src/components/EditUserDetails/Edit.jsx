import "./Edit.css";

// AXIOS
import axios from "axios";

// REACT QUERY
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// REACT ROUTER
import { Link, useNavigate, useParams } from "react-router-dom";

// Toast context
import { useToast } from "../../UI/ToastMessage/ToastContext";

// MUI
import {
  Stack,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Box,
  MenuItem,
} from "@mui/material";

// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import HowToRegIcon from "@mui/icons-material/HowToReg";

// BASE URL
import { BASE_URL } from "../../../data/BaseURL";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // ✅ Fetch user details by ID
  const {
    data: Values,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axios.get(BASE_URL + id);
      return res.data;
    },
  });

  // ✅ Mutation to update user
  const mutation = useMutation({
    mutationFn: (updatedData) => axios.put(BASE_URL + id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]); // Refresh updated data
      queryClient.invalidateQueries(["users"]); // Refresh user list if exists
      toast?.open("Details Updated successfully");
      navigate("/"); // Redirect back to home
    },
    onError: (err) => {
      console.error("Error updating user:", err);
      toast?.open("Failed to update details");
    },
  });

  // Handle form submission
  const handleUpdate = (e) => {
    e.preventDefault();
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this Details"
    );
    if (confirmUpdate && Values) {
      mutation.mutate(Values);
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    queryClient.setQueryData(["user", id], (old) => ({
      ...old,
      [field]: value,
    }));
  };

  if (isLoading) return <p>Loading user details...</p>;
  if (isError) return <p>Error fetching user details</p>;

  return (
    <div className='update_container'>
      <form onSubmit={handleUpdate}>
        {/* Avatar */}
        <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
          <HowToRegIcon />
        </Avatar>
        <h1>Edit Details</h1>

        <Stack spacing={3} direction='column'>
          <Stack spacing={4} direction='column'>
            {/* FULL NAME */}
            <TextField
              label='Full Name'
              size='small'
              required
              value={Values.full_name || ""}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />

            {/* EMAIL */}
            <TextField
              label='Email'
              type='email'
              size='small'
              required
              value={Values.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {/* GENDER */}
            <Box width='100%'>
              <TextField
                label='Select Gender'
                size='small'
                fullWidth
                select
                value={Values.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
              </TextField>
            </Box>

            {/* PHONE */}
            <TextField
              label='Phone No'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>+234</InputAdornment>
                ),
              }}
              required
              value={Values.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Stack>

          {/* BUTTONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Link to='/'>
              <Button
                variant='contained'
                size='small'
                endIcon={<KeyboardReturnIcon />}
              >
                Back
              </Button>
            </Link>

            <Button
              type='submit'
              variant='contained'
              color='success'
              size='small'
              disabled={mutation.isLoading}
              endIcon={<CheckCircleOutlineIcon style={{ color: "white" }} />}
            >
              {mutation.isLoading ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Stack>
      </form>
    </div>
  );
}

export default Edit;
