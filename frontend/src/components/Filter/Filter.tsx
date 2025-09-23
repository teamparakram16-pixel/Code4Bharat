import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  Autocomplete,
  TextField,
  Chip,
  Tabs,
  Tab,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Slide,
  CircularProgress,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Close, FilterList, Refresh } from "@mui/icons-material";
import { ayurvedicMedicines } from "@/constants/ayurvedicMedicines";
import { diseasesList } from "@/constants/diseasesList";

interface FilterProps {
  applyFilters: (filters: string) => Promise<void>;
  getAllPosts: () => Promise<void>;
}

export const Filter: FC<FilterProps> = ({ applyFilters, getAllPosts }) => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [loadingMedicines, setLoadingMedicines] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, boolean>
  >({
    herbs: false,
    routines: false,
    wellnessTips: false,
    diet: false,
    yoga: false,
    detox: false,
    seasonal: false,
  });

  const categories = [
    { id: "herbs", label: "Herbs & Remedies", icon: "🌿" },
    { id: "routines", label: "Daily Routines", icon: "⏰" },
    { id: "wellnessTips", label: "Wellness Tips", icon: "💡" },
    { id: "diet", label: "Diet & Nutrition", icon: "🍽️" },
    { id: "yoga", label: "Yoga & Pranayama", icon: "🧘" },
    { id: "detox", label: "Detox & Cleansing", icon: "🧹" },
    { id: "seasonal", label: "Seasonal Care", icon: "🌸" },
  ];

  const getAllDiseasesList = () => {
    setLoadingDiseases(true);
    setTimeout(() => {
      setDiseases(diseasesList);
      setLoadingDiseases(false);
    }, 500);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleApplyFilters = async () => {
    try {
      const filters = {
        categories: Object.entries(selectedCategories)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        diseases: selectedDiseases,
        medicines: selectedMedicines,
      };

      const queryString = Object.entries(filters)
        .map(([_key, value]) => value.join(","))
        .filter((filter) => filter !== "")
        .join(",");

      setOpen(false);
      await applyFilters(queryString);
    } catch (err) {
      console.error(err);
    }
  };

  const applyGetAllPosts = async () => {
    try {
      setSelectedCategories({
        herbs: false,
        routines: false,
        wellnessTips: false,
        diet: false,
        yoga: false,
        detox: false,
        seasonal: false,
      });
      setSelectedDiseases([]);
      setSelectedMedicines([]);
      setOpen(false);
      await getAllPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const getAyurvedicMedicinesList = async () => {
    try {
      if (medicines.length > 0) return;
      setLoadingMedicines(true);
      setTimeout(() => {
        setMedicines(ayurvedicMedicines);
        setLoadingMedicines(false);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  <Button
    variant="outlined"
    startIcon={<FilterList />}
    onClick={() => setOpen(true)}
    sx={{
      px: 3,
      py: 1,
      borderRadius: "8px",
      fontWeight: 600,
      letterSpacing: "0.5px",
      transition: "all 0.3s ease",
      borderColor: "#059669",
      color: "#059669",
      '&:hover': {
        backgroundColor: "#f0fdf4",
        borderColor: "#047857",
        color: "#047857",
      },
    }}
  >
    Filter
  </Button>
</motion.div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
        fullScreen={isMobile}
        TransitionComponent={Slide}
        transitionDuration={300}
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? 0 : "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              borderBottom: "1px solid #e5e7eb",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              p: { xs: 2, sm: 3 } 
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <FilterList />
                </Box>
                <Box>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 700,
                      color: "#065f46",
                      lineHeight: 1.2,
                    }}
                  >
                    Filter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      mt: 0.5,
                    }}
                  >
                    Discover personalized Ayurvedic content
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Tabs */}
            <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                aria-label="filter tabs"
                sx={{
                  "& .MuiTabs-root": {
                    minHeight: { xs: 40, sm: 48 },
                  },
                  "& .MuiTab-root": {
                    minHeight: { xs: 40, sm: 48 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#059669",
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                <Tab
                  label="Categories"
                  icon={<Box sx={{ fontSize: "1.2rem" }}>🏷️</Box>}
                  iconPosition="start"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: tabValue === 0 ? "#065f46" : "#6b7280",
                    "&:hover": {
                      color: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                    },
                  }}
                />
                <Tab
                  label="Diseases"
                  icon={<Box sx={{ fontSize: "1.2rem" }}>🔬</Box>}
                  iconPosition="start"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: tabValue === 1 ? "#065f46" : "#6b7280",
                    "&:hover": {
                      color: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                    },
                  }}
                />
                <Tab
                  label="Medicines"
                  icon={<Box sx={{ fontSize: "1.2rem" }}>💊</Box>}
                  iconPosition="start"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: tabValue === 2 ? "#065f46" : "#6b7280",
                    "&:hover": {
                      color: "#059669",
                      backgroundColor: "rgba(5, 150, 105, 0.08)",
                    },
                  }}
                />
              </Tabs>
            </Box>
          </Paper>

          {/* Content */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            minHeight: { xs: "60vh", sm: "50vh" },
            maxHeight: { xs: "60vh", sm: "50vh" },
            overflow: "auto",
          }}>
            <AnimatePresence mode="wait">
              {/* Categories Tab */}
              {tabValue === 0 && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      mb: 2,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    Select Categories
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      mb: 3,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Choose from our curated Ayurvedic categories to find relevant content
                  </Typography>
                  
                  <Box sx={{ 
                    display: "grid", 
                    gridTemplateColumns: { 
                      xs: "1fr", 
                      sm: "repeat(2, 1fr)", 
                      md: "repeat(3, 1fr)" 
                    }, 
                    gap: 2 
                  }}>
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Paper
                          elevation={selectedCategories[category.id] ? 3 : 1}
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            borderRadius: "12px",
                            background: selectedCategories[category.id]
                              ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                              : "white",
                            border: selectedCategories[category.id]
                              ? "2px solid #059669"
                              : "2px solid transparent",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: selectedCategories[category.id]
                                ? "#f0fdf4"
                                : "#f9fafb",
                              borderColor: "#059669",
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedCategories[category.id]}
                                onChange={() => handleCategoryChange(category.id)}
                                sx={{
                                  color: "#059669",
                                  "&.Mui-checked": {
                                    color: "#059669",
                                  },
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "1.5rem" }}>
                                  {category.icon}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    fontWeight: 500,
                                    color: "#374151",
                                  }}
                                >
                                  {category.label}
                                </Typography>
                              </Box>
                            }
                            sx={{
                              margin: 0,
                              width: "100%",
                              "& .MuiFormControlLabel-label": {
                                flex: 1,
                              },
                            }}
                          />
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              )}

              {/* Diseases Tab */}
              {tabValue === 1 && (
                <motion.div
                  key="diseases"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      mb: 2,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    Filter by Diseases
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      mb: 3,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Select specific diseases to find targeted Ayurvedic treatments and remedies
                  </Typography>
                  
                  <Autocomplete
                    multiple
                    loading={loadingDiseases}
                    options={diseases}
                    value={selectedDiseases}
                    onChange={(_event, newValue) => {
                      setSelectedDiseases(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, delay: index * 0.1 }}
                        >
                          <Chip
                            variant="filled"
                            label={option}
                            {...getTagProps({ index })}
                            sx={{
                              m: 0.5,
                              backgroundColor: "#059669",
                              color: "white",
                              fontWeight: 500,
                              borderRadius: "8px",
                              "& .MuiChip-deleteIcon": {
                                color: "white",
                                "&:hover": {
                                  color: "#f3f4f6",
                                },
                              },
                            }}
                          />
                        </motion.div>
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Search & Select Diseases"
                        placeholder="Type to search diseases..."
                        onFocus={getAllDiseasesList}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            "& fieldset": {
                              borderColor: "#e5e7eb",
                              borderWidth: "2px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#059669",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#059669",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#6b7280",
                            "&.Mui-focused": {
                              color: "#059669",
                            },
                          },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingDiseases && (
                                <CircularProgress
                                  size={20}
                                  sx={{ 
                                    color: "#059669", 
                                    mr: 1 
                                  }}
                                />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </motion.div>
              )}

              {/* Medicines Tab */}
              {tabValue === 2 && (
                <motion.div
                  key="medicines"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      mb: 2,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    Filter by Medicines
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      mb: 3,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Discover content related to specific Ayurvedic medicines and herbal formulations
                  </Typography>
                  
                  <Autocomplete
                    multiple
                    loading={loadingMedicines}
                    options={medicines}
                    value={selectedMedicines}
                    onChange={(_event, newValue) => {
                      setSelectedMedicines(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, delay: index * 0.1 }}
                        >
                          <Chip
                            variant="filled"
                            label={option}
                            {...getTagProps({ index })}
                            sx={{
                              m: 0.5,
                              backgroundColor: "#10b981",
                              color: "white",
                              fontWeight: 500,
                              borderRadius: "8px",
                              "& .MuiChip-deleteIcon": {
                                color: "white",
                                "&:hover": {
                                  color: "#f3f4f6",
                                },
                              },
                            }}
                          />
                        </motion.div>
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Search & Select Medicines"
                        placeholder="Type to search medicines..."
                        onFocus={getAyurvedicMedicinesList}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            "& fieldset": {
                              borderColor: "#e5e7eb",
                              borderWidth: "2px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#10b981",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#10b981",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#6b7280",
                            "&.Mui-focused": {
                              color: "#10b981",
                            },
                          },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingMedicines && (
                                <CircularProgress
                                  size={20}
                                  sx={{ 
                                    color: "#10b981", 
                                    mr: 1 
                                  }}
                                />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Footer Actions */}
          <Paper
            elevation={0}
            sx={{
              borderTop: "1px solid #e5e7eb",
              p: { xs: 2, sm: 3 },
              backgroundColor: "#fafafa",
            }}
          >
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={applyGetAllPosts}
                  fullWidth={isMobile}
                  sx={{
                    color: "#6b7280",
                    borderColor: "#d1d5db",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                      borderColor: "#9ca3af",
                      color: "#374151",
                    },
                  }}
                >
                  Reset All Filters
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                  fullWidth={isMobile}
                  sx={{
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                      boxShadow: "0 6px 16px rgba(5, 150, 105, 0.4)",
                    },
                  }}
                >
                  Apply Filters
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};