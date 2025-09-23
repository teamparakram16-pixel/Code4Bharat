import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Material UI Components
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// Custom logic
import addRoutineFormSchema from "./AddRoutineFormSchema";
import useRoutines from "@/hooks/useRoutine/useRoutine";
import { demoRoutineData } from "@/utils/demoData";

type RoutineFormSchema = z.infer<typeof addRoutineFormSchema>;

export interface RoutineFormRef {
  fillDemoData: (type: 'valid' | 'invalid') => void;
}

const AddRoutineForm = forwardRef<RoutineFormRef>((_props, ref) => {
  const { submitRoutinePost } = useRoutines();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useForm<RoutineFormSchema>({
    resolver: zodResolver(addRoutineFormSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: null,
      routines: [{ time: "", content: "" }],
    },
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailRef = useRef<HTMLInputElement | null>(null);

  const {
    fields: routineFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "routines",
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("thumbnail", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
    if (thumbnailRef.current) thumbnailRef.current.value = "";
  };

  const cancelThumbnail = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    form.setValue("thumbnail", null);
    setThumbnailPreview(null);
  };

  // Expose fillDemoData method to parent component
  useImperativeHandle(ref, () => ({
    fillDemoData: (type: 'valid' | 'invalid') => {
      const demoArray = type === 'valid' ? demoRoutineData.valid : demoRoutineData.invalid;
      const selectedDemo = demoArray[Math.floor(Math.random() * demoArray.length)];
      
      form.reset({
        title: selectedDemo.title,
        description: selectedDemo.description,
        thumbnail: null,
        routines: selectedDemo.routines,
      });
      
      // Clear thumbnail preview when filling demo data
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
      }
    }
  }));

  const onSubmit = async (newRoutinePostData: RoutineFormSchema) => {
    try {
      const response = await submitRoutinePost(newRoutinePostData);
      if (response?.success) {
        form.reset();
        navigate(`/routines/${response?.postId}`);
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
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Create New Routine
      </Typography>
      
      <Divider sx={{ my: 3 }} />

      <Stack spacing={4}>
        {/* Title */}
        <TextField
          fullWidth
          label="Routine Title"
          variant="outlined"
          error={!!form.formState.errors.title}
          helperText={form.formState.errors.title?.message}
          {...form.register("title")}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          error={!!form.formState.errors.description}
          helperText={form.formState.errors.description?.message}
          {...form.register("description")}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        />

        {/* Thumbnail Upload */}
        <Box>
          <Box
            component="input"
            type="file"
            accept="image/*"
            ref={thumbnailRef}
            onChange={handleThumbnailChange}
            sx={{ display: "none" }}
            title="Upload thumbnail image"
          />
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => thumbnailRef.current?.click()}
            sx={{ borderRadius: 2 }}
          >
            Upload Thumbnail
          </Button>
          
          {thumbnailPreview && (
            <Box sx={{ mt: 2, position: "relative", width: "100%", maxWidth: 300 }}>
              <Box
                component="img"
                src={thumbnailPreview}
                alt="Thumbnail preview"
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "error.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "error.dark",
                  },
                }}
                onClick={cancelThumbnail}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Routine Entries */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
              Routine Entries
            </Typography>
            <Button
              variant="text"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => append({ time: "", content: "" })}
              sx={{ textTransform: "none" }}
            >
              Add Entry
            </Button>
          </Box>

          <Stack spacing={3}>
            {routineFields.map((routine, index) => (
              <Paper
                key={routine.id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  position: "relative",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                  {/* Time Picker */}
                  <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                    <FormControl fullWidth error={!!form.formState.errors.routines?.[index]?.time}>
                      <TimePicker
                        label="Time"
                        ampm
                        value={
                          form.watch(`routines.${index}.time`)
                            ? dayjs(form.watch(`routines.${index}.time`), "hh:mm A")
                            : null
                        }
                        onChange={(val) =>
                          form.setValue(
                            `routines.${index}.time`,
                            val && typeof (val as any).format === 'function' ? (val as any).format("hh:mm A") : ""
                          )
                        }
                        slots={{
                          openPickerIcon: ScheduleIcon,
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            error: !!form.formState.errors.routines?.[index]?.time,
                          },
                        }}
                      />
                      {form.formState.errors.routines?.[index]?.time && (
                        <FormHelperText>
                          {form.formState.errors.routines[index]?.time?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  {/* Content Field */}
                  <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                    <TextField
                      fullWidth
                      label="Content"
                      variant="outlined"
                      multiline
                      rows={2}
                      error={!!form.formState.errors.routines?.[index]?.content}
                      helperText={form.formState.errors.routines?.[index]?.content?.message}
                      {...form.register(`routines.${index}.content`)}
                    />
                  </Box>
                </Box>

                {/* Remove Button */}
                {routineFields.length > 1 && (
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "error.dark",
                      },
                    }}
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={form.formState.isSubmitting}
          startIcon={form.formState.isSubmitting ? <CircularProgress size={20} color="inherit" /> : <></>}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: theme.shadows[2],
            },
          }}
        >
          {form.formState.isSubmitting ? "Creating Routine..." : "Create Routine"}
        </Button>
      </Stack>
    </Box>
  );
});

AddRoutineForm.displayName = "AddRoutineForm";

export default AddRoutineForm;