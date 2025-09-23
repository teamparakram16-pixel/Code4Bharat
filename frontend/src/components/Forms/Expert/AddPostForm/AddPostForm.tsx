import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Close, Description, Image, Movie, Send } from "@mui/icons-material";
import postCreationSchema from "./AddPostFormSchema";
import usePost from "@/hooks/usePost/usePost";
import { demoPostData } from "@/utils/demoData";

type PostFormSchema = z.infer<typeof postCreationSchema>;

export interface PostFormRef {
  fillDemoData: (type: 'valid' | 'invalid') => void;
}

const PostForm = forwardRef<PostFormRef>((_props, ref) => {
  const { submitPost } = usePost();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      media: {
        images: [],
        video: null,
        document: null,
      },
    },
  });

  const [mediaPreview, setMediaPreview] = useState<{
    images: string[];
    video: string | null;
    document: string | null;
  }>({
    images: [],
    video: null,
    document: null,
  });

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  // Expose fillDemoData method to parent component
  useImperativeHandle(ref, () => ({
    fillDemoData: (type: 'valid' | 'invalid') => {
      const demoArray = type === 'valid' ? demoPostData.valid : demoPostData.invalid;
      const selectedDemo = demoArray[Math.floor(Math.random() * demoArray.length)];
      
      form.setValue('title', selectedDemo.title);
      form.setValue('description', selectedDemo.description);
      // Reset media to empty
      form.setValue('media.images', []);
      form.setValue('media.video', null);
      form.setValue('media.document', null);
      setMediaPreview({ images: [], video: null, document: null });
    }
  }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentImages = form.getValues("media.images") || [];
    if (currentImages.length + newFiles.length > 3) {
      alert("You can only upload up to 3 images in total.");
      return;
    }
    const updatedImages = [...currentImages, ...newFiles];
    form.setValue("media.images", updatedImages);
    form.setValue("media.document", null);
    form.setValue("media.video", null);
    setMediaPreview((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ],
      document: null,
      video: null,
    }));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media.images", []);
      form.setValue("media.document", null);
      form.setValue("media.video", file);
      setMediaPreview({
        images: [],
        document: null,
        video: URL.createObjectURL(file),
      });
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media.images", []);
      form.setValue("media.video", null);
      form.setValue("media.document", file);
      setMediaPreview({
        images: [],
        video: null,
        document: URL.createObjectURL(file),
      });
    }
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handleImagePreviewCancel = (i: number) => {
    URL.revokeObjectURL(mediaPreview.images[i]);
    const newImages =
      mediaPreview.images?.filter((_, index) => index !== i) || [];
    setMediaPreview((prev) => ({ ...prev, images: newImages }));
    const currentImages = form.getValues("media.images") || [];
    const newFiles = currentImages.filter((_, index) => index !== i);
    form.setValue("media.images", newFiles);
  };

  const handleVideoPreviewCancel = () => {
    if (mediaPreview.video) URL.revokeObjectURL(mediaPreview.video);
    setMediaPreview((prev) => ({ ...prev, video: null }));
    form.setValue("media.video", null);
  };

  const handleDocPreviewCancel = () => {
    if (mediaPreview.document) URL.revokeObjectURL(mediaPreview.document);
    setMediaPreview((prev) => ({ ...prev, document: null }));
    form.setValue("media.document", null);
  };

  const onSubmit = async (newPostData: PostFormSchema) => {
    try {

      const response = await submitPost(newPostData);
      if (response?.success) {
        form.reset();
        navigate(`/gposts/${response?.postId}`);
      }
    } catch (error: any) {
      console.error("Post failed:", error.message);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        Create New Post
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          error={!!form.formState.errors.title}
          helperText={form.formState.errors.title?.message}
          {...form.register("title")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2" color="text.secondary">
                  📝
                </Typography>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={5}
          error={!!form.formState.errors.description}
          helperText={form.formState.errors.description?.message}
          {...form.register("description")}
        />

        <Box
          component="input"
          type="file"
          accept="image/*"
          multiple
          ref={imageInputRef}
          onChange={handleImageChange}
          sx={{ display: "none" }}
          title="Upload image(s)"
        />
        <Box
          component="input"
          type="file"
          accept="video/*"
          ref={videoInputRef}
          onChange={handleVideoChange}
          sx={{ display: "none" }}
          title="Upload video"
        />
        <Box
          component="input"
          type="file"
          accept=".pdf"
          ref={docInputRef}
          onChange={handleDocChange}
          sx={{ display: "none" }}
          title="Upload PDF document"
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
            Add Media
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Image />}
              onClick={() => imageInputRef.current?.click()}
              sx={{ flex: 1 }}
            >
              Images
            </Button>
            <Button
              variant="outlined"
              startIcon={<Movie />}
              onClick={() => videoInputRef.current?.click()}
              sx={{ flex: 1 }}
            >
              Video
            </Button>
            <Button
              variant="outlined"
              startIcon={<Description />}
              onClick={() => docInputRef.current?.click()}
              sx={{ flex: 1 }}
            >
              Document
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {mediaPreview.images.length > 0
              ? `${mediaPreview.images.length} image(s) selected`
              : mediaPreview.video
              ? "1 video selected"
              : mediaPreview.document
              ? "1 document selected"
              : "No media selected"}
          </Typography>
        </Box>

        {(mediaPreview.images.length > 0 ||
          mediaPreview.video ||
          mediaPreview.document) && (
          <Paper
            elevation={0}
            sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Media Preview
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {mediaPreview.images?.map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 16px)",
                      md: "calc(33.33% - 16px)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: "100%" }}>
                    <Box
                      component="img"
                      src={img}
                      alt={`preview-${i}`}
                      sx={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.8)",
                        },
                      }}
                      onClick={() => handleImagePreviewCancel(i)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                    <Chip
                      label={`Image ${i + 1}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                    />
                  </Box>
                </Box>
              ))}

              {mediaPreview.video && (
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ position: "relative" }}>
                    <Box
                      component="video"
                      controls
                      src={mediaPreview.video}
                      sx={{
                        width: "100%",
                        maxHeight: "300px",
                        borderRadius: 1,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.8)",
                        },
                      }}
                      onClick={handleVideoPreviewCancel}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {mediaPreview.document && (
                <Box sx={{ width: "100%" }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Description color="primary" />
                      <Typography variant="body2">
                        {form.getValues("media.document")?.name || "Document"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => {
                          window.open(mediaPreview.document || "", "_blank");
                        }}
                      >
                        View
                      </Button>
                      <IconButton size="small" onClick={handleDocPreviewCancel}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={form.formState.isSubmitting}
          startIcon={
            form.formState.isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Send />
            )
          }
          sx={{
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: theme.shadows[2],
            },
          }}
        >
          {form.formState.isSubmitting ? "Posting..." : "Publish Post"}
        </Button>
      </Stack>
    </Box>
  );
});

export default PostForm;
