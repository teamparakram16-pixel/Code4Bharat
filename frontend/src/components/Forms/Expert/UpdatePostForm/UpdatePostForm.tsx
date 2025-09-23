import React, { useEffect, useState, useRef } from "react";
import usePost from "../../../../hooks/usePost/usePost";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import { Chip, Alert, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// ...existing code...

const UpdatePostForm: React.FC = () => {
  const { id: postId } = useParams();
  const { updatePost, getPostById } = usePost();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filters, setFilters] = useState<string>("");
  const [filterInput, setFilterInput] = useState("");
  const filterInputRef = useRef<HTMLInputElement>(null);

  // Pro color palette
  const primaryMain = theme?.palette?.primary?.main || '#388E3C';
  const primaryDark = theme?.palette?.primary?.dark || '#1B5E20';
  const accentGreen = theme?.palette?.success?.main || '#43A047';
  // const accentLight = theme?.palette?.success?.light || '#C8E6C9';
  const backgroundSoft = theme?.palette?.background?.paper || '#F8F9FA';
  // const textPrimary = theme?.palette?.text?.primary || '#212121';
  // const textSecondary = theme?.palette?.text?.secondary || '#757575';

  // Styled components using local theme
  const StyledCard = styled(Card)(() => ({
    maxWidth: 800,
    margin: "auto",
    boxShadow: "0 8px 32px 0 rgba(56, 142, 60, 0.15)",
    borderRadius: 18,
    overflow: "hidden",
    background: backgroundSoft,
    position: 'relative',
  }));

  const HeaderSection = styled(Box)(() => ({
    padding: theme.spacing(4, 3, 3, 3),
    background: `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 100%)`,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    position: 'relative',
    boxShadow: "0 4px 24px 0 rgba(56, 142, 60, 0.10)",
  }));

  const FormSection = styled(Box)(() => ({
    padding: theme.spacing(4),
    background: backgroundSoft,
    borderRadius: 12,
    boxShadow: "0 2px 8px 0 rgba(56, 142, 60, 0.07)",
  }));

  const SubmitButton = styled(Button)(() => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontWeight: 600,
    fontSize: 16,
    background: `linear-gradient(90deg, ${accentGreen} 0%, ${primaryMain} 100%)`,
    color: "#fff",
    boxShadow: "0 2px 8px rgba(56,142,60,0.15)",
    borderRadius: 8,
    transition: "all 0.2s",
    '&:hover': {
      background: `linear-gradient(90deg, ${primaryMain} 0%, ${accentGreen} 100%)`,
      boxShadow: "0 4px 16px rgba(56,142,60,0.25)",
    },
    '&:disabled': {
      background: '#e0e0e0',
      color: '#a5a5a5',
    },
  }));

  const FilterHint = styled(Typography)(() => ({
    fontSize: 14,
    color: accentGreen,
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  }));

// ...existing code...

  const AnimatedBox = motion.create(Box);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getPostById(postId!);
      const fetched = res.post;
      setTitle(fetched.title);
      setDescription(fetched.description);
      setFilters(fetched.filters.join(", "));
    } catch (err: any) {
      setError("Failed to fetch post");
      console.error("Failed to fetch post:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);
    if (title.length < 5) {
      setError("Title should be at least 5 characters");
      setIsSubmitting(false);
      return;
    }
    if (description.length < 20) {
      setError("Description should be at least 20 characters");
      setIsSubmitting(false);
      return;
    }
    const updatedPost = {
      title,
      description,
      filters: filters.split(",").map((f) => f.trim()).filter(Boolean),
    };
    try {
      await updatePost(postId!, updatedPost);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setTimeout(() => navigate(`/gposts/${postId}`), 2000);
    } catch (err: any) {
      setSuccess(false);
      setError(err.message || "Failed to update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} style={{ color: primaryMain }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 },  minHeight: '100vh' }}>
      <StyledCard>
        <HeaderSection>
          <IconButton sx={{ position: 'absolute', left: 16, top: 16, color: 'white' }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <EditIcon sx={{ fontSize: 40, opacity: 0.85 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600">
              Update Ayurvedic Post
            </Typography>
            <Typography variant="subtitle1" mt={1}>
              Revise and enhance your knowledge sharing
            </Typography>
          </Box>
        </HeaderSection>
        <FormSection>
          <form onSubmit={handleSubmit} autoComplete="off">
            <AnimatedBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
              )}
              {success && (
                <Alert severity="success" onClose={() => setSuccess(false)}>
                  Post updated successfully!
                </Alert>
              )}
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  InputProps={{ style: { fontSize: 16 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                  error={title.length > 0 && title.length < 5}
                  helperText={title.length > 0 && title.length < 5 ? "Title should be at least 5 characters" : ""}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  multiline
                  minRows={6}
                  maxRows={12}
                  InputProps={{ style: { fontSize: 16 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                  error={description.length > 0 && description.length < 20}
                  helperText={description.length > 0 && description.length < 20 ? "Description should be at least 20 characters" : ""}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Add Filters"
                  variant="outlined"
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filterInput.trim()) {
                      e.preventDefault();
                      const newFilter = filterInput.trim();
                      const filtersArr = filters.split(',').map(f => f.trim()).filter(Boolean);
                      if (!filtersArr.includes(newFilter)) {
                        setFilters(filtersArr.concat(newFilter).join(', '));
                      }
                      setFilterInput("");
                      if (filterInputRef.current) filterInputRef.current.blur();
                    }
                  }}
                  inputRef={filterInputRef}
                  InputProps={{ style: { fontSize: 16 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                  placeholder="Type and press Enter to add multiple filters"
                />
                <FilterHint>
                  Example: herbs, digestion, detox (separate multiple filters with commas)
                </FilterHint>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {filters.split(',').map((filter, idx) => {
                    const f = filter.trim();
                    if (!f) return null;
                    return (
                      <Chip
                        key={idx}
                        label={f}
                        onDelete={() => {
                          const filtersArr = filters.split(',').map(f => f.trim()).filter(Boolean);
                          filtersArr.splice(idx, 1);
                          setFilters(filtersArr.join(', '));
                        }}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    );
                  })}
                </Box>
              </Box>
              <Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="flex-end">
                  <SubmitButton
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || title.length < 5 || description.length < 20}
                    startIcon={success ? <CheckCircleIcon /> : <EditIcon />}
                  >
                    {isSubmitting ? "Saving..." : success ? "Saved!" : "Update Post"}
                  </SubmitButton>
                </Box>
              </Box>
            </AnimatedBox>
          </form>
        </FormSection>
      </StyledCard>
    </Box>
  );
};

export default UpdatePostForm;