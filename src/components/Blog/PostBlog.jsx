import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../UI/ToastMessage/ToastContext";
import {
  Button,
  Typography,
  TextField,
  LinearProgress,
  Box,
  InputLabel,
  FormHelperText,
  Stack,
} from "@mui/material";
import {
  Article as ArticleIcon,
  CloudUpload as CloudUploadIcon,
  RestartAlt as RestartAltIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { createPost } from "../../api/blogApi";

// 🔹 Validation Schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  author: yup.string().required("Author is required"),
  image: yup.string().required("Image is required"),
});

export default function BlogForm() {
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();
  const toast = useToast();

  // 🔹 React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const title = watch("title");
  const author = watch("author");
  const content = watch("content");

  // 🔹 Mutation
  const mutation = useMutation({
    mutationFn: (formData) => createPost(formData, setUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast?.open("✅ Post created successfully!");
      reset();
      setPreview(null);
      setUploadProgress(0);
    },
    onError: (err) => {
      console.error(err);
      toast?.open("❌ Failed to create post. Try again.");
      setUploadProgress(0);
    },
  });

  // 🔹 Submit Handler
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("author", data.author);
    formData.append("image", data.image[0]);
    mutation.mutate(formData);
  };

  // 🔹 Handle Image
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

  return (
    <div className='grid md:grid-cols-2 gap-10 lg:gap-10 items-start my-2'>
      {/* --- BLOG FORM --- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid space-y-6 h-screen bg-white p-6 rounded-2xl shadow-md grid-cols-1'
      >
        <Typography
          variant='h4'
          fontWeight='bold'
          className='text-center flex items-center justify-center gap-2 text-transparent bg-clip-text bg-linear-to-r from-green-500 to-blue-600'
        >
          <ArticleIcon className='text-blue-600' /> Create New Blog Post
        </Typography>

        {/* Title */}
        <TextField
          {...register("title")}
          label='Post Title'
          variant='outlined'
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* Content */}
        <TextField
          {...register("content")}
          label='Post Content'
          variant='outlined'
          fullWidth
          multiline
          minRows={4}
          error={!!errors.content}
          helperText={errors.content?.message}
        />

        {/* Author */}
        <TextField
          {...register("author")}
          label='Author'
          variant='outlined'
          fullWidth
          error={!!errors.author}
          helperText={errors.author?.message}
        />

        {/* Image Upload */}
        <Box sx={{ mt: 2 }}>
          <Stack direction='row' alignItems='center' spacing={1} mb={1.5}>
            <ImageIcon color='primary' />
            <InputLabel
              htmlFor='image-upload'
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Featured Image
            </InputLabel>
          </Stack>

          <Button
            variant='outlined'
            component='label'
            fullWidth
            startIcon={<ImageIcon />}
            sx={{
              textTransform: "none",
              borderColor: "#90caf9",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            Upload Image
            <input
              id='image-upload'
              type='file'
              hidden
              accept='image/*'
              {...register("image")}
              onChange={handleImageChange}
            />
          </Button>

          {errors.image && (
            <FormHelperText error>{errors.image.message}</FormHelperText>
          )}

          {preview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={preview}
                alt='Preview'
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #e0e0e0",
                }}
              />

              <Button
                variant='contained'
                color='error'
                onClick={() => setPreview(null)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Remove Image
              </Button>
            </Box>
          )}
        </Box>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <Box className='mt-3'>
            <Typography
              variant='body2'
              className='flex items-center gap-2 text-gray-600 mb-1'
            >
              <CloudUploadIcon className='text-blue-500' /> Uploading{" "}
              {uploadProgress}%
            </Typography>
            <LinearProgress
              variant='determinate'
              value={uploadProgress}
              color='primary'
              sx={{ borderRadius: "4px" }}
            />
          </Box>
        )}

        {/* Buttons */}
        <Box className='flex flex-col sm:flex-row gap-4 mt-6'>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={mutation.isLoading}
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            {mutation.isLoading ? "Submitting..." : "Submit Post"}
          </Button>

          <Button
            variant='contained'
            color='warning'
            startIcon={<RestartAltIcon />}
            fullWidth
            onClick={() => {
              reset();
              setPreview(null);
              setUploadProgress(0);
            }}
          >
            Reset
          </Button>
        </Box>
      </form>

      {/* --- LIVE PREVIEW --- */}
      <section className='container h-screen bg-gray-50 shadow-sm flex flex-col justify-center items-center text-center gap-4 rounded-2xl'>
        <Typography
          variant='h6'
          className='bg-linear-to-r from-yellow-100 to-pink-200 w-4/5 text-gray-800 py-2 flex justify-center gap-2 rounded-md'
        >
          <VisibilityIcon className='text-blue-500' /> Live Preview
        </Typography>

        {preview ? (
          <img
            src={preview}
            alt='Preview'
            className='w-4/5 h-60 object-contain rounded-lg border border-gray-200 mb-3'
          />
        ) : (
          <Box className='w-4/5 h-60 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4'>
            <ImageIcon className='text-gray-400 mr-2' /> No image selected
          </Box>
        )}

        <Box className='flex flex-col gap-1 items-center w-4/5 h-60 rounded-lg'>
          <Typography
            variant='h6'
            className='w-full font-semibold text-gray-700 bg-linear-to-r from-yellow-100 to-pink-200 py-1 rounded'
          >
            {title || "Post title preview"}
          </Typography>

          <Typography
            variant='body2'
            className='w-full text-gray-500 italic bg-linear-to-r from-yellow-100 to-pink-200 py-1 rounded'
          >
            {author || "No Author"}
          </Typography>

          <Typography
            variant='body2'
            className='text-gray-700 text-sm w-full h-50 whitespace-pre-line line-clamp-6 px-4 py-2 bg-linear-to-r from-yellow-100 to-pink-200 rounded'
          >
            {content || (
              <span className='text-gray-500 italic'>
                Post content will appear here...
              </span>
            )}
          </Typography>
        </Box>
      </section>
    </div>
  );
}
