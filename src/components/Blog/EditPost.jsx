import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, updatePost } from "../../api/blogApi";
import { useToast } from "../../UI/ToastMessage/ToastContext";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import {
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

// ✅ Validation Schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  author: yup.string().required("Author is required"),
  image: yup.mixed().nullable(),
});

export default function EditPost() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 🔹 Fetch existing post
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPosts(id),
  });

  // 🔹 React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 🔹 Populate fields when post is loaded
  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("author", post.author);
      setPreview(`http://localhost/PHP/Blog/uploads/${post.image}`);
    }
  }, [post, setValue]);

  // 🔹 Update Mutation
  const mutation = useMutation({
    mutationFn: (formData) => updatePost(id, formData, setUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast?.open("✅ Post updated successfully!");
      navigate("/Home");
    },
    onError: () => {
      toast?.open("❌ Failed to update post.");
      setUploadProgress(0);
    },
  });

  // 🔹 Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setPreview(null);

    if (file.size > 5 * 1024 * 1024) {
      toast?.open("⚠️ Image must be less than 5MB");
      e.target.value = null;
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  // 🔹 Submit handler
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("author", data.author);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    mutation.mutate(formData);
  };

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color='error' align='center' mt={10}>
        Failed to load post data.
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 6,
        p: { xs: 2, md: 6 },
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      {/* 🔹 Edit Form */}
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          background:
            "linear-gradient(to bottom right, #e3f2fd, #fff3e0, #fce4ec)",
        }}
      >
        <Typography
          variant='h4'
          fontWeight='bold'
          textAlign='center'
          sx={{
            mb: 4,
            background: "linear-gradient(to right, #43a047, #2196f3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ✏️ Edit Blog Post
        </Typography>

        <TextField
          fullWidth
          label='Title'
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
          margin='normal'
        />

        <TextField
          fullWidth
          multiline
          rows={5}
          label='Content'
          {...register("content")}
          error={!!errors.content}
          helperText={errors.content?.message}
          margin='normal'
        />

        <TextField
          fullWidth
          label='Author'
          {...register("author")}
          error={!!errors.author}
          helperText={errors.author?.message}
          margin='normal'
        />

        {/* 🔹 Image Upload */}
        <Box sx={{ mt: 3 }}>
          <InputLabel className='flex items-center gap-2 text-gray-700 mb-2'>
            <ImageIcon color='primary' /> Featured Image
          </InputLabel>
          <input
            type='file'
            accept='image/*'
            {...register("image")}
            onChange={handleImageChange}
            className='w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition'
          />
          {errors.image && (
            <Typography color='error' variant='caption'>
              {errors.image.message}
            </Typography>
          )}

          {preview && (
            <Box className='mt-3 space-y-2'>
              <img
                src={preview}
                alt='Preview'
                className='w-full h-40 object-cover rounded-lg border'
              />
              <Button
                variant='contained'
                color='error'
                fullWidth
                onClick={() => setPreview(null)}
              >
                Remove Image
              </Button>
            </Box>
          )}
        </Box>

        {/* 🔹 Upload Progress */}
        {uploadProgress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Uploading... {uploadProgress}%
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                backgroundColor: "#e0e0e0",
              }}
            >
              <Box
                sx={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: "#2196f3",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>
        )}

        {/* 🔹 Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            fullWidth
            startIcon={<SaveIcon />}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." : "Update Post"}
          </Button>

          <Button
            variant='contained'
            color='warning'
            fullWidth
            startIcon={<ResetIcon />}
            onClick={() => {
              reset();
              setPreview(`http://localhost/PHP/Blog/uploads/${post.image}`);
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {/* 🔹 Live Preview */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          borderRadius: 3,
          boxShadow: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography
          variant='h6'
          sx={{
            mb: 3,
            color: "#424242",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <UploadIcon color='primary' /> Live Preview
        </Typography>

        {preview ? (
          <img
            src={preview}
            alt='Preview'
            style={{
              width: "80%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "80%",
              height: 200,
              backgroundColor: "#e0e0e0",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#757575",
            }}
          >
            No Image Selected
          </Box>
        )}

        <Typography variant='h6' fontWeight='bold' sx={{ mt: 2 }}>
          {post?.title || "Post Title"}
        </Typography>
        <Typography variant='subtitle2' sx={{ color: "text.secondary", mb: 1 }}>
          {post?.author || "Author"}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            width: "80%",
            textAlign: "center",
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          {post?.content || "Post content will appear here..."}
        </Typography>
      </Box>
    </Box>
  );
}
