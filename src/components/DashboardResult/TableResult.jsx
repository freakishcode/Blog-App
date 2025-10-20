import { useContext } from "react";
import "./TableResult.css";

// AXIOS
import axios from "axios";

// importing the created context FROM HOME COMPONENT
import { AppContext } from "../../Context/Context";

// React router library
import { Link } from "react-router-dom";

// Material UI library
import { Button, Stack } from "@mui/material";

// MATERIAL UI ICONS
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchOffIcon from "@mui/icons-material/SearchOff";

// TODO: DATA BASE JSON
import { FIREBASE_URL } from "../../../data/BaseURL";

// TODO: Accessing Toast context message
import { useToast } from "../../UI/ToastMessage/ToastContext";

// ✅ React Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar"; // ✅ import your SearchBar

export default function TableResult() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const TableHeader = [
    { id: "id", name: "ID" },
    { id: "name", name: "Full Name" },
    { id: "email", name: "Email" },
    { id: "gender", name: "Gender" },
    { id: "phone", name: "Mobile No" },
  ];

  const { DebounceSearchValue } = useContext(AppContext);

  if (DebounceSearchValue === undefined) {
    throw new Error(
      "You forgot to wrap your context name in a provider and provide a value"
    );
  }

  // Safely normalize data to an array
  const rows = Array.isArray(DebounceSearchValue)
    ? DebounceSearchValue
    : DebounceSearchValue && typeof DebounceSearchValue === "object"
    ? Object.values(DebounceSearchValue)
    : [];

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${FIREBASE_URL}${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast?.open("User deleted successfully");
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      toast?.open("Failed to delete user");
    },
  });

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirm) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className='TableContainer'>
      {/* ✅ Header with search bar */}
      <div className='table-header'>
        <h2>List of Users</h2>
        <SearchBar />
      </div>

      <table>
        <thead>
          <tr>
            {TableHeader.map((column) => (
              <th key={column.id}>{column.name}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {DebounceSearchValue.length === 0 ? (
            <tr>
              <td colSpan={TableHeader.length + 1} className='no-results'>
                <SearchOffIcon className='no-results-icon' />
                No users found
              </td>
            </tr>
          ) : (
            rows.map((records, id) => (
              <tr key={records.id ?? id}>
                <td>{id + 1}</td>
                <td>{records.full_name}</td>
                <td>{records.email}</td>
                <td>{records.gender}</td>
                <td>{records.phone}</td>

                <td className='Action_Btn'>
                  <Stack direction='row' spacing={3}>
                    <Link to={`/Read/${records.id}`}>
                      <Button
                        variant='contained'
                        startIcon={
                          <AutoStoriesIcon style={{ color: "white" }} />
                        }
                        className='table_btn'
                      >
                        Read
                      </Button>
                    </Link>

                    <Link to={`/Update/${records.id}`}>
                      <Button
                        variant='contained'
                        color='warning'
                        endIcon={<UpdateIcon style={{ color: "white" }} />}
                        className='table_btn'
                      >
                        Update
                      </Button>
                    </Link>

                    <Button
                      variant='contained'
                      color='error'
                      endIcon={<DeleteForeverIcon />}
                      className='table_btn'
                      onClick={() => handleDelete(records.id)}
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
