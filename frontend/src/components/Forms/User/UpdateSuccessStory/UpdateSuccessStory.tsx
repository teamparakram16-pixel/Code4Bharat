import React, { useEffect, useState } from "react";
import useSuccessStory from "../../../../hooks/useSuccessStory/useSuccessStory";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Paper,
  Stack,
  useTheme
} from "@mui/material";
import { AddCircleOutline, DeleteOutline, Schedule, Description, Title, Image } from "@mui/icons-material";
import { styled } from "@mui/system";

interface OwnerProfile {
  fullName: string;
  profileImage: string;
}

interface Routine {
  time: string;
  content: string;
}

interface SuccessStory {
  _id: string;
  title: string;
  description: string;
  routines: Routine[];
  filters: string[];
  media: {
    images: string[];
    video: string | null;
    document: string | null;
  };
  readTime: string;
  likesCount: number;
  commentsCount: number;
  owner: {
    profile: OwnerProfile;
    _id: string;
  };
  createdAt: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
}));

const RoutineItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme?.palette?.grey?.[50] ?? '#f5f5f5',
  borderRadius: "8px",
}));

const UpdateSuccessStory: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: storyId } = useParams();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<Routine>({ time: "", content: "" });

  const { getSuccessStoryById, updateSuccessStory } = useSuccessStory();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await getSuccessStoryById(storyId!);
        const fetchedStory = res?.successStory;

        if (!fetchedStory) {
          toast.error("Success story not found.");
          return;
        }

        setStory(fetchedStory);
        setTitle(fetchedStory.title || "");
        setDescription(fetchedStory.description || "");

        const parsedRoutines = (fetchedStory.routines || []).map((item: any) =>
          typeof item === "string" ? { time: "", content: item } : item
        );
        setRoutines(parsedRoutines);
      } catch (err: any) {
        console.error("Error fetching story:", err.message);
        toast.error("Failed to fetch success story.");
      }
    };

    fetchStory();
  }, [storyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedRoutines = [...routines];
    if (newRoutine.time.trim() && newRoutine.content.trim()) {
      updatedRoutines.push({ ...newRoutine });
    }

    const cleanedRoutines = updatedRoutines.map(({ time, content }) => ({ time, content }));

    try {
      await updateSuccessStory(storyId!, {
        title,
        description,
        routines: cleanedRoutines,
      });
      navigate(`/success-stories/${storyId}`);
    } catch (err: any) {
      console.error("Update failed:", err.message);
    }
  };

  const handleAddRoutine = () => {
    if (newRoutine.time.trim() && newRoutine.content.trim()) {
      setRoutines([...routines, newRoutine]);
      setNewRoutine({ time: "", content: "" });
    }
  };

  const handleRemoveRoutine = (index: number) => {
    setRoutines(routines.filter((_, i) => i !== index));
  };

  const handleRoutineChange = (
    index: number,
    key: keyof Routine,
    value: string
  ) => {
    const updated = [...routines];
    updated[index][key] = value;
    setRoutines(updated);
  };

  if (!story) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography variant="h6">Loading story details...</Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      p: 10, 
      width: "100%",
      maxWidth: "100vw",
      minWidth: "100vw",
      margin: "0 auto",
      [theme.breakpoints.down('md')]: {
        p: 2
      }
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 600, 
        mb: 4,
        color: theme.palette.primary.main
      }}>
        Update Success Story
      </Typography>

      <Box sx={{
        display: 'flex',
        gap: 4,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start'
      }}>
        {/* Left Column - Story Details */}
        <Box sx={{
          width: { xs: '100%', md: '40%' },
          position: { md: 'sticky' },
          top: { md: 20 }
        }}>
          <StyledCard>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar
                  src={story.owner.profile.profileImage}
                  alt={story.owner.profile.fullName}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6">{story.owner.profile.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: theme.palette.text.secondary
                }}>
                  <Schedule fontSize="small" /> Story Details
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 500 }}>Read Time:</Box> {story.readTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 500 }}>Likes:</Box> {story.likesCount}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 500 }}>Comments:</Box> {story.commentsCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {story.filters.length > 0 && (
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {story.filters.map((filter, index) => (
                      <Chip 
                        key={index} 
                        label={filter} 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.palette.grey[200],
                          color: theme.palette.text.primary
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {story.media.images?.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: theme.palette.text.secondary
                  }}>
                    <Image fontSize="small" /> Media
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    '& img': {
                      flex: '1 1 calc(33% - 8px)',
                      minWidth: 0,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }
                  }}>
                    {story.media.images.map((img, index) => (
                      <Box
                        component="img"
                        src={img}
                        alt={`img-${index}`}
                        key={index}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Box>

        {/* Right Column - Edit Form */}
        <Box sx={{ 
          width: { xs: '100%', md: '60%' },
          flexGrow: 1
        }}>
          <StyledCard>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Box mb={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 2,
                    color: theme.palette.text.secondary
                  }}>
                    <Title fontSize="small" /> Story Title
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter story title"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 2,
                    color: theme.palette.text.secondary
                  }}>
                    <Description fontSize="small" /> Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell your success story..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 2,
                    color: theme.palette.text.secondary
                  }}>
                    <Schedule fontSize="small" /> Routines
                  </Typography>
                  
                  {routines.map((routine, index) => (
                    <RoutineItem key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                        [theme.breakpoints.down('sm')]: {
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 1
                        }
                      }}>
                        <Box sx={{ 
                          flex: '1 1 30%',
                          [theme.breakpoints.down('sm')]: {
                            width: '100%'
                          }
                        }}>
                          <TextField
                            fullWidth
                            label="Time"
                            value={routine.time}
                            onChange={(e) => handleRoutineChange(index, "time", e.target.value)}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ 
                          flex: '1 1 60%',
                          [theme.breakpoints.down('sm')]: {
                            width: '100%'
                          }
                        }}>
                          <TextField
                            fullWidth
                            label="Content"
                            value={routine.content}
                            onChange={(e) => handleRoutineChange(index, "content", e.target.value)}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ 
                          flex: '1 1 10%',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          [theme.breakpoints.down('sm')]: {
                            width: '100%',
                            justifyContent: 'flex-start'
                          }
                        }}>
                          <IconButton
                            onClick={() => handleRemoveRoutine(index)}
                            color="error"
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.error.light,
                              '&:hover': {
                                backgroundColor: theme.palette.error.main,
                                color: 'white'
                              }
                            }}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Box>
                      </Box>
                    </RoutineItem>
                  ))}

                  <RoutineItem>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 2,
                      [theme.breakpoints.down('sm')]: {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 1
                      }
                    }}>
                      <Box sx={{ 
                        flex: '1 1 30%',
                        [theme.breakpoints.down('sm')]: {
                          width: '100%'
                        }
                      }}>
                        <TextField
                          fullWidth
                          label="New Time"
                          value={newRoutine.time}
                          onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ 
                        flex: '1 1 60%',
                        [theme.breakpoints.down('sm')]: {
                          width: '100%'
                        }
                      }}>
                        <TextField
                          fullWidth
                          label="New Content"
                          value={newRoutine.content}
                          onChange={(e) => setNewRoutine({ ...newRoutine, content: e.target.value })}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ 
                        flex: '1 1 10%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        [theme.breakpoints.down('sm')]: {
                          width: '100%',
                          justifyContent: 'flex-start'
                        }
                      }}>
                        <IconButton
                          onClick={handleAddRoutine}
                          color="primary"
                          size="small"
                          disabled={!newRoutine.time.trim() || !newRoutine.content.trim()}
                          sx={{
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.main,
                              color: 'white'
                            },
                            '&.Mui-disabled': {
                              backgroundColor: theme.palette.grey[200]
                            }
                          }}
                        >
                          <AddCircleOutline />
                        </IconButton>
                      </Box>
                    </Box>
                  </RoutineItem>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mt: 4,
                  gap: 2
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                      px: 4,
                      borderRadius: '8px',
                      borderWidth: '2px',
                      '&:hover': {
                        borderWidth: '2px'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      px: 4,
                      borderRadius: '8px',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Update Story
                  </Button>
                </Box>
              </form>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateSuccessStory;