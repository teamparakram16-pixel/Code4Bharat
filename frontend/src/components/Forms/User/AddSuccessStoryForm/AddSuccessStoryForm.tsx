import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  useTheme,
  Avatar,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Description as FileTextIcon,
  VideoLibrary as VideoIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import formSchema from "./AddSuccessStoryFormSchema";
import { Doctor } from "./AddSuccessStoryFormSchema.types";
import useApi from "@/hooks/useApi/useApi";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import { toast } from "react-toastify";
import { demoSuccessStoryData } from "@/utils/demoData";

type FormValues = z.infer<typeof formSchema>;

export interface SuccessStoryFormRef {
  fillDemoData: (type: 'valid' | 'invalid') => void;
}

export interface ExpertProfile {
  expertType: "ayurvedic" | "naturopathy" | string;
  profileImage: string;
}

export interface Expert {
  _id: string;
  username: string;
  profile: ExpertProfile;
}

const AddSuccessStoryForm = forwardRef<SuccessStoryFormRef>((_props, ref) => {
  const theme = useTheme();
  const { get } = useApi();
  const { submitSuccessStory } = useSuccessStory();
  const navigate = useNavigate();

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaPreview, setMediaPreview] = useState<{
    images: string[];
    video: string | null;
    document: string | null;
  }>({
    images: [],
    video: null,
    document: null,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      media: {
        images: [],
        video: null,
        document: null,
      },
      hasRoutines: false,
      routines: undefined,
      tagged: [],
    },
  });

  const {
    fields: routineFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "routines",
  });

  // Expose fillDemoData method to parent component
  useImperativeHandle(ref, () => ({
    fillDemoData: (type: 'valid' | 'invalid') => {
      const demoArray = type === 'valid' ? demoSuccessStoryData.valid : demoSuccessStoryData.invalid;
      const selectedDemo = demoArray[Math.floor(Math.random() * demoArray.length)];
      
      form.reset({
        title: selectedDemo.title,
        description: selectedDemo.description,
        media: {
          images: [],
          video: null,
          document: null,
        },
        hasRoutines: selectedDemo.hasRoutines,
        routines: selectedDemo.hasRoutines ? selectedDemo.routines : undefined,
        tagged: [],
      });
      
      // Clear media previews when filling demo data
      setMediaPreview({
        images: [],
        video: null,
        document: null,
      });
    }
  }));

  const onSubmit = async (formData: FormValues) => {
    try {
      const newSuccessStoryData = {
        title: formData.title,
        description: formData.description,
        media: {
          images: formData.media?.images,
          video: formData.media?.video,
          document: formData.media?.document,
        },
        routines: formData.hasRoutines ? formData.routines ?? [] : [],
        tagged: formData.tagged.map((taggedDoctor) => taggedDoctor.id),
      };
      const response = await submitSuccessStory(newSuccessStoryData);
      if (response?.success) {
        form.reset();
        navigate(`/success-stories/${response?.postId}`);
      }
    } catch (error: any) {
      console.error("Post failed:", error.message);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentImages = form.getValues("media.images") || [];
    if (currentImages.length + newFiles.length > 3) {
      toast.warn("You can only upload up to 3 images in total.");
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
    }));
    imageInputRef.current!.value = "";
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
    videoInputRef.current!.value = "";
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    docInputRef.current!.value = "";
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
    URL.revokeObjectURL(mediaPreview.video || "");
    setMediaPreview((prev) => ({ ...prev, video: null }));
    form.setValue("media.video", null);
  };

  const handleDocPreviewCancel = () => {
    URL.revokeObjectURL(mediaPreview.document || "");
    setMediaPreview((prev) => ({ ...prev, document: null }));
    form.setValue("media.document", null);
  };

  const searchDoctors = async (query: string) => {
    try {
      setIsSearching(true);

      // Simulate API call
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/search/doctors`,
        {
          params: { q: query },
        }
      );


      const doctors = response.doctors.map((doctor: Expert) => ({
        id: doctor._id,
        name: doctor.username,
        avatar:
          doctor.profile.profileImage || "/placeholder.svg?height=40&width=40",
      }));

      setSearchResults(doctors);
      setIsSearching(false);
    } catch (error: any) {
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    }
  };

  const selectDoctor = (doctor: Doctor) => {
    const currentDoctors = form.getValues("tagged") || [];

    if (currentDoctors.some((d) => d.id === doctor.id)) return;

    if (currentDoctors.length >= 5) {
      form.setError("tagged", {
        type: "manual",
        message: "You can select up to 5 doctors",
      });
      return;
    }

    form.setValue("tagged", [...currentDoctors, doctor]);
    form.clearErrors("tagged");
  };

  const removeDoctor = (doctorId: string) => {
    const currentDoctors = form.getValues("tagged") || [];
    form.setValue(
      "tagged",
      currentDoctors.filter((d) => d.id !== doctorId)
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, #ffffff 100%)`,
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container sx={{ px: { xs: 0, lg: 2 } }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            px: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              lineHeight: 1.2,
            }}
          >
            Share Your{" "}
            <Typography
              component="span"
              color="primary.main"
              sx={{
                fontWeight: 700,
                fontSize: "inherit",
                display: "inline",
              }}
            >
              Success Story
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Inspire others by sharing your journey to wellness and recovery
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: 3,
            border: "none",
          }}
        >
          {/* Card Header with Gradient */}
          <CardHeader
            title={
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "common.white",
                  textAlign: "center",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Create Success Story
              </Typography>
            }
            subheader={
              <Typography
                variant="body1"
                sx={{
                  color: "primary.light",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                Share your journey to inspire others
              </Typography>
            }
            sx={{
              py: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            }}
          />

          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Title Field */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <TextField
                  label="Title"
                  variant="outlined"
                  placeholder="Enter success story title"
                  {...form.register("title")}
                  error={!!form.formState.errors.title}
                  helperText={form.formState.errors.title?.message}
                />
                <FormHelperText>
                  Give your success story a compelling title
                </FormHelperText>
              </FormControl>

              {/* Description Field */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <TextField
                  label="Description"
                  variant="outlined"
                  placeholder="Describe the success story in detail"
                  multiline
                  rows={4}
                  {...form.register("description")}
                  error={!!form.formState.errors.description}
                  helperText={form.formState.errors.description?.message}
                />
                <FormHelperText>
                  Provide a detailed description of the success story
                </FormHelperText>
              </FormControl>

              {/* Media Upload Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Media Upload
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Upload images, a video, or a document to accompany your
                  success story
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    mt: 2,
                  }}
                >
                  {/* Images Upload */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "33.33%" },
                      p: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImageIcon fontSize="large" color="action" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1">Upload Images</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Multiple allowed
                    </Typography>
                    <input
                      type="file"
                      ref={imageInputRef}
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      title="Upload Images"
                      onChange={handleImagesChange}
                    />
                  </Box>

                  {/* Video Upload */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "33.33%" },
                      p: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <VideoIcon fontSize="large" color="action" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1">Upload Video</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Single file
                    </Typography>
                    <input
                      type="file"
                      ref={videoInputRef}
                      accept="video/*"
                      style={{ display: "none" }}
                      title="Upload Video"
                      onChange={handleVideoChange}
                    />
                  </Box>

                  {/* Document Upload */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "33.33%" },
                      p: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={() => docInputRef.current?.click()}
                  >
                    <FileTextIcon
                      fontSize="large"
                      color="action"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="subtitle1">Upload Document</Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF only
                    </Typography>
                    <input
                      type="file"
                      ref={docInputRef}
                      accept=".pdf"
                      style={{ display: "none" }}
                      title="Upload Document"
                      onChange={handleDocumentChange}
                    />
                  </Box>
                </Box>

                {/* Media Previews */}
                {mediaPreview.images?.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Image Previews
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      {mediaPreview.images?.map((url, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "calc(50% - 16px)",
                              md: "calc(33.33% - 16px)",
                            },
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              borderRadius: 1,
                              overflow: "hidden",
                              height: 120,
                            }}
                          >
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                backgroundColor: "error.main",
                                color: "common.white",
                                "&:hover": {
                                  backgroundColor: "error.dark",
                                },
                              }}
                              onClick={() => handleImagePreviewCancel(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {mediaPreview.video && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Video Preview
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 1,
                        overflow: "hidden",
                        maxHeight: 300,
                      }}
                    >
                      <video
                        src={mediaPreview.video}
                        controls
                        style={{ width: "100%" }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "error.main",
                          color: "common.white",
                          "&:hover": {
                            backgroundColor: "error.dark",
                          },
                        }}
                        onClick={handleVideoPreviewCancel}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {mediaPreview.document && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Document Preview
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FileTextIcon color="action" sx={{ mr: 2 }} />
                        <Typography variant="body2">
                          {form.getValues("media.document")?.name || "Document"}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={handleDocPreviewCancel}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Box>
                )}
              </Box>

              {/* Routines Section */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Checkbox
                    checked={form.watch("hasRoutines")}
                    onChange={(e) => {
                      form.setValue("hasRoutines", e.target.checked);
                      if (e.target.checked) {
                        form.setValue("routines", [
                          {
                            time: "",
                            content: "",
                          },
                        ]);
                      } else {
                        form.setValue("routines", undefined);
                      }
                    }}
                  />
                  <Box>
                    <Typography variant="h6" component="h3">
                      Include Routines
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add daily routines that contributed to the success
                    </Typography>
                  </Box>
                </Box>

                {form.watch("hasRoutines") && (
                  <Box
                    sx={{
                      pl: 4,
                      borderLeft: 2,
                      borderColor: "divider",
                      mb: 2,
                    }}
                  >
                    {routineFields.map((field, index) => (
                      <Box
                        key={field.id}
                        sx={{
                          mb: 3,
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 2,
                          alignItems: { md: "flex-end" },
                        }}
                      >
                        <TimePicker
                          label="Time"
                          ampm
                          value={
                            form.watch(`routines.${index}.time`)
                              ? dayjs(
                                  form.watch(`routines.${index}.time`),
                                  "hh:mm A"
                                )
                              : null
                          }
                          onChange={(val) =>
                            form.setValue(
                              `routines.${index}.time`,
                              val && typeof (val as any).format === "function"
                                ? (val as any).format("hh:mm A")
                                : null
                            )
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error:
                                !!form.formState.errors.routines?.[index]?.time,
                              helperText:
                                form.formState.errors.routines?.[index]?.time
                                  ?.message,
                            },
                          }}
                          sx={{ width: { xs: "100%", md: 200 } }}
                        />

                        <TextField
                          label="Routine Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          {...form.register(`routines.${index}.content`)}
                          error={
                            !!form.formState.errors.routines?.[index]?.content
                          }
                          helperText={
                            form.formState.errors.routines?.[index]?.content
                              ?.message
                          }
                        />

                        <IconButton
                          onClick={() => remove(index)}
                          disabled={routineFields.length === 1}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => append({ time: "", content: "" })}
                      sx={{ mt: 1 }}
                    >
                      Add Routine
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Doctor Tagging Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Doctor Tagging
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tag up to 5 doctors who contributed to this success story
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Add Doctors
                </Button>

                {form.watch("tagged")?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {form.watch("tagged").map((doctor) => (
                      <Chip
                        key={doctor.id}
                        avatar={
                          <Avatar
                            src={doctor.avatar || "/placeholder.svg"}
                            alt={doctor.name}
                          />
                        }
                        label={doctor.name}
                        variant="outlined"
                        onDelete={() => removeDoctor(doctor.id)}
                        deleteIcon={<CloseIcon fontSize="small" />}
                      />
                    ))}
                  </Box>
                )}

                {form.formState.errors.tagged && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {form.formState.errors.tagged.message}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={form.formState.isSubmitting}
                startIcon={
                  form.formState.isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : null
                }
              >
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : "Submit Success Story"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Doctor Search Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Search Doctors</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => searchDoctors(searchQuery)}
              disabled={isSearching || searchQuery.length < 2}
              startIcon={
                isSearching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Search
            </Button>
          </Box>

          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              borderTop: 1,
              borderColor: "divider",
              pt: 2,
            }}
          >
            {isSearching ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                }}
              >
                <CircularProgress />
              </Box>
            ) : searchResults.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {searchResults.map((doctor) => (
                  <Paper
                    key={doctor.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={() => selectDoctor(doctor)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={doctor.avatar} alt={doctor.name} />
                      <Typography>{doctor.name}</Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={form
                        .getValues("tagged")
                        ?.some((d) => d.id === doctor.id)}
                    >
                      {form.getValues("tagged")?.some((d) => d.id === doctor.id)
                        ? "Added"
                        : "Add"}
                    </Button>
                  </Paper>
                ))}
              </Box>
            ) : searchQuery.length > 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 4 }}
              >
                No doctors found
              </Typography>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 4 }}
              >
                Search for doctors by name
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

AddSuccessStoryForm.displayName = "AddSuccessStoryForm";

export default AddSuccessStoryForm;
