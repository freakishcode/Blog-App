import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "../Context/Context";
import useDebounce from "../Hooks/useDebounce";
import TableResult from "./DashboardResult/TableResult";

import { fetchUsers } from "../api/Crud_api";

// Material UI
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

function ListOfUsers() {
  // ✅ React Query handles fetching, caching, and error states
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Debounce search
  const debouncedSearch = useDebounce(users, 1000);

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Box textAlign='center' mb={3}>
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            List For Blog Post Users
          </Typography>
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

export default ListOfUsers;
