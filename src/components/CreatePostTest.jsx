import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostTest } from "../api/blogApi";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Stack,
  Avatar,
  IconButton,
  InputLabel,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import SnackbarToast from "./SnackbarToast";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
});

export default function CreatePostTest() {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileRef = useRef();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", content: "", author: "" },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      // Make sure we always reset progress when new upload starts
      setProgress(0);

      // Call the API helper
      const response = await createPostTest(formData, (evt) => {
        if (evt?.total) {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percent);
        }
      });

      // Validate the backend structure
      if (!response?.data?.success) {
        const errMsg =
          response?.data?.error ||
          (response?.data?.errors && response.data.errors.join(", ")) ||
          "Unexpected server response";
        throw new Error(errMsg);
      }

      return response.data;
    },

    onSuccess: (data) => {
      setToast({
        open: true,
        message: data.message || "Post created successfully",
        severity: "success",
      });

      // optional: refresh posts list
      queryClient.invalidateQueries(["posts"]);

      // reset form & states
      reset();
      setImagePreview(null);
      setImageFile(null);
      setProgress(0);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.error ||
        (error?.response?.data?.errors &&
          error.response.data.errors.join(", ")) ||
        error.message ||
        "Upload failed";

      setToast({ open: true, message, severity: "error" });
      setProgress(0);
    },

    retry: false, // disable retries for file uploads (safe choice)
  });

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setToast({
        open: true,
        message: "Invalid image type",
        severity: "error",
      });
      fileRef.current.value = "";
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setToast({
        open: true,
        message: "Image exceeds 10MB limit",
        severity: "error",
      });
      fileRef.current.value = "";
      return;
    }
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(values) {
    // Build FormData to match your PHP code expectations
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("author", values.author);
    if (imageFile) {
      formData.append("image_url", imageFile, imageFile.name);
    }

    await mutation.mutateAsync({ formData });
  }

  return (
    <Box className='min-h-screen flex items-center justify-center p-4'>
      <Paper elevation={6} className='max-w-3xl w-full p-6'>
        <Typography variant='h5' component='h1' gutterBottom>
          Create Post
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType='multipart/form-data'
          noValidate
        >
          <Stack spacing={2}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Title'
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name='content'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Content'
                  fullWidth
                  multiline
                  minRows={5}
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
            />

            <Controller
              name='author'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Author'
                  fullWidth
                  error={!!errors.author}
                  helperText={errors.author?.message}
                />
              )}
            />

            <Box>
              <InputLabel sx={{ mb: 1 }}>Image (optional)</InputLabel>
              <Stack direction='row' spacing={2} alignItems='center'>
                <input
                  ref={fileRef}
                  accept='image/*'
                  id='image_upload'
                  type='file'
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor='image_upload'>
                  <Button
                    variant='contained'
                    component='span'
                    startIcon={<PhotoCamera />}
                  >
                    Choose Image
                  </Button>
                </label>

                {imagePreview && (
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar
                      variant='rounded'
                      src={imagePreview}
                      sx={{ width: 80, height: 80 }}
                    />
                    <IconButton aria-label='remove' onClick={removeImage}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Stack>
              <Typography variant='caption'>
                Allowed: jpg, png, webp, gif — max 10MB
              </Typography>
            </Box>

            {progress > 0 && (
              <Box>
                <LinearProgress variant='determinate' value={progress} />
                <Typography variant='caption'>{progress}%</Typography>
              </Box>
            )}

            <Stack direction='row' spacing={2} justifyContent='flex-end'>
              <Button
                color='secondary'
                variant='outlined'
                onClick={() => {
                  reset();
                  removeImage();
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>

              <Button
                type='submit'
                variant='contained'
                disabled={isSubmitting || mutation.isLoading}
              >
                {mutation.isLoading ? "Uploading..." : "Create Post"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

      <SnackbarToast
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </Box>
  );
}
