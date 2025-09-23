import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Button,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { DoctorCard } from "@/components/DoctorCard/DoctorCards";
import { useSearchDoctors } from "@/hooks/useDoctorSearch/useDoctorSearch";
import SearchIcon from "@mui/icons-material/Search";

const DoctorSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    doctors,
    loading,
    error,
    fetchDoctors,
    fetchAllDoctors,
  } = useSearchDoctors();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchAllDoctors();
    } else {
      fetchDoctors(searchTerm);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f0f2 100%)',
        overflowX: 'hidden',
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 2, md: 4 } }}>
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 4, sm: 6 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0f2 100%)",
          p: { xs: 2, sm: 4, md: 6 },
          borderRadius: 4,
          boxShadow: 1,
          maxWidth: 900,
          mx: "auto"
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: theme.palette.primary.main,
            background: "linear-gradient(45deg, #1976d2 0%, #2196f3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            [theme.breakpoints.down("sm")]: {
              fontSize: "2.2rem"
            }
          }}
        >
          Find Your Perfect Doctor
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 4 }}
        >
          Search from our network of experienced healthcare professionals
        </Typography>

        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: { xs: 0.5, sm: 1 },
            borderRadius: 50,
            boxShadow: 3,
            maxWidth: 700,
            mx: "auto",
            background: "white"
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by doctor name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              sx: {
                border: "none",
                "& fieldset": { border: "none" },
                borderRadius: 50,
                px: 2
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  border: "none"
                }
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading}
            endIcon={<SearchIcon />}
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(45deg, #1976d2 0%, #2196f3 100%)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)",
                boxShadow: "none"
              }
            }}
          >
            Search
          </Button>
        </Paper>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={10}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          my={10}
          textAlign="center"
          sx={{
            p: 4,
            borderRadius: 2,
            background: theme.palette.error.light,
            maxWidth: 600,
            mx: "auto"
          }}
        >
          <Typography variant="h6" color="error.main" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography color="error.dark">{error}</Typography>
        </Box>
      ) : doctors.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          my={10}
          textAlign="center"
          sx={{
            p: 4,
            borderRadius: 2,
            background: theme.palette.grey[100],
            maxWidth: 600,
            mx: "auto"
          }}
        >
          <Typography variant="h6" gutterBottom color="text.secondary">
            No doctors found
          </Typography>
          <Typography color="text.secondary">
            Try searching with different keywords
          </Typography>
        </Box>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          gap={{ xs: 2, sm: 3, md: 4 }}
          justifyContent={isMobile ? "center" : "flex-start"}
          px={{ xs: 0, sm: 1, md: 2 }}
          maxWidth={1200}
          mx="auto"
        >
          {doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))}
        </Box>
      )}
      </Container>
    </Box>
  );
};

export default DoctorSearch;