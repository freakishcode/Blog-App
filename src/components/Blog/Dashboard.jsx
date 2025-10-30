import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, deletePost } from "../../api/blogApi";
import { useToast } from "../../UI/ToastMessage/ToastContext";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Box,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function BlogDashboard() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  // 🔹 Fetch Posts
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // ✅ Normalize posts data safely
  const postsData = Array.isArray(posts)
    ? posts
    : posts && typeof posts === "object"
    ? Object.values(posts)
    : [];

  // 🔹 Delete Post Mutation
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast?.open("🗑️ Post deleted successfully");
    },
    onError: () => {
      toast?.open("❌ Failed to delete post");
    },
  });

  // 🔹 Loading State
  if (isLoading)
    return (
      <Stack
        alignItems='center'
        justifyContent='center'
        sx={{ height: "80vh" }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading posts...</Typography>
      </Stack>
    );

  // 🔹 Error State
  if (isError)
    return (
      <Stack alignItems='center' sx={{ mt: 10 }}>
        <Typography color='error' variant='h6'>
          Failed to load posts.
        </Typography>
        <Button
          onClick={refetch}
          variant='contained'
          sx={{ mt: 2 }}
          color='primary'
        >
          Retry
        </Button>
      </Stack>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: "1200px", mx: "auto" }}>
      <Typography
        variant='h4'
        fontWeight='bold'
        textAlign='center'
        sx={{
          mb: 6,
          background: "linear-gradient(to right, #2196f3, #4caf50)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🧭 Blog Dashboard
      </Typography>

      {/* No Posts Message */}
      {postsData.length === 0 && (
        <Typography
          align='center'
          sx={{ color: "text.secondary", fontStyle: "italic", mt: 8 }}
        >
          No posts found. Create a new post to get started.
        </Typography>
      )}

      {/* Posts Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
      >
        {postsData.map((post) => (
          <Card
            key={post.id}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            {/* Post Image */}
            <Box
              component='img'
              src={`http://localhost/PHP/Blog/uploads/${post.image}`}
              alt={post.title}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />

            {/* Post Details */}
            <CardContent>
              <Typography variant='h6' fontWeight='bold' gutterBottom>
                {post.title}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                sx={{
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.content}
              </Typography>

              <Typography variant='caption' color='text.disabled'>
                ✍️ {post.author} — {new Date(post.created_at).toLocaleString()}
              </Typography>
            </CardContent>

            {/* Actions */}
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<EditIcon />}
                onClick={() => navigate(`/Edit/${post.id}`)}
                sx={{
                  flex: 1,
                  mr: 1,
                  textTransform: "none",
                }}
              >
                Edit
              </Button>

              <Button
                variant='contained'
                color='error'
                startIcon={<DeleteIcon />}
                disabled={mutation.isLoading}
                onClick={() => mutation.mutate(post.id)}
                sx={{
                  flex: 1,
                  textTransform: "none",
                }}
              >
                {mutation.isLoading ? "Deleting..." : "Delete"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
