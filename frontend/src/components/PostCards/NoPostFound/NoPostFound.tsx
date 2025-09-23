import { Box, Typography, Button } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface NoPostFoundProps {
  onReset?: () => void;
  message?: string;
  mt?: number | string;
}

const NoPostFound: React.FC<NoPostFoundProps> = ({ onReset, message, mt }) => (
  <Box
    sx={{
      maxWidth: 700,
      mx: "auto",
      width: "100%",
      p: 3,
      borderRadius: 3,
      backgroundColor: "background.paper",
      boxShadow: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      mt: mt !== undefined ? mt : -6,
      gap: 1.5,
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        mb: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f7fa 0%, #f0fdf4 100%)",
        borderRadius: "50%",
        boxShadow: 1,
      }}
    >
      <SearchIcon sx={{ fontSize: 32, color: "primary.main" }} />
    </Box>
    <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, color: "primary.main", letterSpacing: 1 }}>
      No posts found
    </Typography>
    <Typography
      variant="body1"
      sx={{ color: "text.secondary", textAlign: "center", mb: 1.5 }}
    >
      {message || "Try adjusting your search or filters to find what you're looking for."}
    </Typography>
    {onReset && (
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onReset}
        startIcon={<SearchIcon />}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          px: 3,
          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.12)",
          background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
        }}
      >
        Clear Search
      </Button>
    )}
  </Box>
);

export default NoPostFound;
