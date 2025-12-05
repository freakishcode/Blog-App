import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 🔹 Toast Message Context
import { useToast } from "../../UI/ToastMessage/ToastContext";
// 🔹 API Function
import { createPost } from "../../api/blogApi";

// 🔹 MUI Components
import {
  Button,
  Typography,
  TextField,
  LinearProgress,
  Box,
  InputLabel,
  FormHelperText,
  Stack,
  InputAdornment,
  Avatar,
} from "@mui/material";

// 🔹 Icons
import {
  Title as TitleIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  CloudUpload as CloudUploadIcon,
  RestartAlt as RestartAltIcon,
  Visibility as VisibilityIcon,
  PhotoCamera as PhotoCamera,
  Image as ImageIcon,
} from "@mui/icons-material";

// 🔹 Validation Schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  author: yup.string().required("Author is required"),
  image_url: yup.mixed().required("An Image is required"),
  // .test("fileSize", "Image must be less than 5MB", (value) => {
  //   return value && value[0] && value[0].size <= 5 * 1024 * 1024;
  // })
  // .test("fileType", "Unsupported image format", (value) => {
  //   const allowed = [
  //     "image/jpeg",
  //     "image/jpg",
  //     "image/png",
  //     "image/gif",
  //     "image/webp",
  //   ];
  //   return value && value[0] && allowed.includes(value[0].type);
  // }),
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

  // 🔹 Watch form fields for live preview
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
    formData.append("image_url", data.image_url[0]);
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
    <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full '>
      {/* --- BLOG FORM --- */}
      <Box
        component='form'
        sx={{
          "& .MuiTextField-root": { width: "80%" },
        }}
        className='bg-white shadow-sm flex flex-col   rounded-2xl justify-around items-center'
        onSubmit={handleSubmit(onSubmit)}
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
          variant='filled'
          error={!!errors.title}
          helperText={errors.title?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <TitleIcon color='action' />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          {...register("content")}
          label='Post Content'
          variant='filled'
          multiline
          minRows={5}
          error={!!errors.content}
          helperText={errors.content?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <DescriptionIcon color='action' />
              </InputAdornment>
            ),
          }}
        />

        {/* Author */}
        <TextField
          {...register("author")}
          label='Author'
          variant='filled'
          error={!!errors.author}
          helperText={errors.author?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonIcon color='action' />
              </InputAdornment>
            ),
          }}
        />

        {/* Image Upload */}
        <Box sx={{ mt: 2 }}>
          <Stack direction='row' alignItems='center' spacing={1} mb={1.5}>
            <ImageIcon color='primary' />
            <InputLabel
              htmlFor='image-upload'
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Featured Image (optional)
            </InputLabel>
          </Stack>

          <Button
            variant='outlined'
            component='label'
            fullWidth
            startIcon={<PhotoCamera />}
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
              {...register("image_url")}
              onChange={handleImageChange}
            />
          </Button>

          <Typography color='red' variant='caption'>
            Allowed: jpg, png, webp, gif — max 10MB
          </Typography>

          {errors.image_url && (
            <FormHelperText error>{errors.image_url.message}</FormHelperText>
          )}

          {preview && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt='Preview'
                src={preview}
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
        <Box className='flex flex-col sm:flex-row gap-4 mt-6 w-4/6 px-4'>
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
      </Box>

      {/* --- LIVE PREVIEW --- */}
      <Box className='h-screen bg-gray-50 shadow-sm flex flex-col justify-center items-center text-center gap-4 rounded-2xl'>
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
      </Box>
    </div>
  );
}
