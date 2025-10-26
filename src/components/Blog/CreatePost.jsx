import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

import { Button, Typography } from "@mui/material";

import {
  Article as ArticleIcon,
  Title as TitleIcon,
  Category as CategoryIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  RestartAlt as RestartAltIcon,
  Visibility as VisibilityIcon,
  Tag as TagIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";

const API_URL =
  "https://react-crud-firebase-proj-f9029-default-rtdb.firebaseio.com/blogpost.json";

export default function BlogPostForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const title = watch("title");
  const category = watch("category");
  const content = watch("content");

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const formData = new FormData();
      Object.entries(newPost).forEach(([key, value]) => {
        if (key === "image" && value?.[0]) formData.append(key, value[0]);
        else formData.append(key, value);
      });
      const { data } = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      return data;
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old) => [newPost, ...(old || [])]);
      return { previousPosts };
    },
    onError: (context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      alert("Error submitting post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      alert("Post added successfully!");
      reset();
      setPreview(null);
      setUploadProgress(0);
    },
  });

  const onSubmit = (data) => {
    const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-");
    mutation.mutate({ ...data, slug });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setPreview(null);
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      e.target.value = null;
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className='w-full shadow-lg rounded-2xl grid place-items-center py-9 grid-cols-1 lg:grid-cols-2 gap-1'>
      {/* Form Section */}
      <div className='container h-screen text-black flex flex-col justify-center items-center bg-linear-to-br from-red-200 via-yellow-70 to-blue-200 rounded-2xl py-4'>
        <Typography
          variant='h4'
          fontWeight='bold'
          className='text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-linear-to-r from-green-400 to-blue-600 flex justify-center items-center gap-2'
        >
          <ArticleIcon className='text-blue-600' /> Create New Blog Post
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
          {/* Title */}
          <div>
            <label className=' font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <TitleIcon className='text-blue-500' /> Title
            </label>
            <input
              type='text'
              {...register("title", { required: "Title is required" })}
              className='w-full border border-gray-600 rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-500 placeholder:text-center '
              placeholder='Enter blog title'
            />
            {errors.title && (
              <p className='text-red-500 text-sm mt-1 text-center'>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className='block font-medium text-gray-700 mb-2'>Slug</label>
            <input
              type='text'
              {...register("slug")}
              defaultValue={title?.toLowerCase().replace(/\s+/g, "-") || ""}
              className='w-full border border-gray-500 rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none
                placeholder:text-gray-500 placeholder:text-center'
              placeholder='auto-generated if blank'
            />
          </div>

          {/* Category */}
          <div>
            <label className=' font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <CategoryIcon className='text-blue-500' /> Category
            </label>
            <select
              {...register("category", { required: "Select a category" })}
              className='w-full border border-gray-500 rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer '
            >
              <option className='text-black' value=''>
                Select Category
              </option>
              <option className='text-black' value='Tech'>
                Tech
              </option>
              <option className='text-black' value='Lifestyle'>
                Lifestyle
              </option>
              <option className='text-black' value='Business'>
                Business
              </option>
            </select>
            {errors.category && (
              <p className='text-red-500 text-center text-sm mt-1'>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className=' font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <TagIcon className='text-blue-500' /> Tags (comma separated)
            </label>
            <input
              type='text'
              {...register("tags")}
              className='w-full border border-gray-500 rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none
                placeholder:text-gray-500 placeholder:text-center'
              placeholder='e.g. react, tailwind, ui'
            />
          </div>

          {/* Content */}
          <div>
            <label className=' font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <NotesIcon className='text-blue-500' /> Content
            </label>
            <textarea
              rows='6'
              {...register("content", { required: "Content is required" })}
              className='w-full border border-gray-500 rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder:text-gray-500 placeholder:text-center placeholder:pt-8'
              placeholder='Write your post content...'
            ></textarea>
            {errors.content && (
              <p className='text-red-500 text-center text-sm mt-1'>
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div className='flex flex-col'>
            <label className=' font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <ImageIcon className='text-blue-500' /> Featured Image
            </label>
            <input
              type='file'
              accept='image/*'
              {...register("image")}
              onChange={handleImageChange}
              className='w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50'
            />
            {preview && (
              <div className='mt-3 relative'>
                <Button
                  variant='contained'
                  color='error'
                  style={{ width: "100%", marginTop: "1rem" }}
                  onClick={() => setPreview(null)}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className='mt-3'>
              <div className='flex items-center gap-2 text-sm text-gray-600 mb-1'>
                <CloudUploadIcon className='text-blue-500' /> Uploading{" "}
                {uploadProgress}%
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-blue-500 h-2.5 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Publish Toggle */}
          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              {...register("published")}
              className='w-4 h-4 text-blue-600'
            />
            <span className='text-gray-700'>Publish immediately</span>
          </div>

          {/* Buttons */}
          <div className='flex flex-col sm:flex-row justify-between gap-4 mt-6'>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={mutation.isLoading}
              className='flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition'
            >
              <CloudUploadIcon />{" "}
              {mutation.isLoading ? "Submitting..." : "Submit Post"}
            </Button>
            <Button
              variant='contained'
              color='warning'
              onClick={() => {
                reset();
                setPreview(null);
              }}
              className='flex items-center justify-center gap-2 flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition'
            >
              <RestartAltIcon /> Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className='container h-screen bg-gray-50 shadow-sm flex flex-col justify-center items-center text-center gap-4 rounded-2xl'>
        <h3 className='bg-linear-to-r from-yellow-100 to-pink-200  w-4/5 text-xl font-semibold text-gray-800 py-1 my-4 flex justify-center gap-2 '>
          <VisibilityIcon className='text-blue-500' /> Live Preview
        </h3>
        {preview ? (
          // preview image
          <img
            src={preview}
            alt='preview'
            className='w-4/5 h-60 bg-cover object-contain rounded-lg border border-gray-200 mb-3 bg-clip-content'
          />
        ) : (
          // Skeleton image
          <div className='w-4/5 h-60 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4'>
            <ImageIcon className='text-gray-400 mr-2' /> No image selected
          </div>
        )}

        {/* POST TITLE , CONTENT, CATEGORY */}
        <div className='flex flex-col gap-1 items-center w-4/5 h-60 rounded-lg'>
          <h4 className='text-lg w-full font-semibold text-gray-500 bg-linear-to-r from-yellow-100 to-pink-200 '>
            {title || "Post title preview"}
          </h4>
          <p className='text-sm w-full text-gray-500 italic bg-linear-to-r from-yellow-100 to-pink-200 '>
            {category || "No category selected"}
          </p>
          <p className='text-gray-700 text-sm w-full h-50 whitespace-pre-line line-clamp-6 px-4 py-2 bg-linear-to-r from-yellow-100 to-pink-200 '>
            {content || (
              <div className='flex items-center justify-center  text-gray-500 mb-4'>
                Post content will appear here...
              </div>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
