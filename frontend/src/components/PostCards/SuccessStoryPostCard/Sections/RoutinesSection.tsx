import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SuccessStoryCardProps } from "../SuccessStoryPostCard.types";

export const RoutinesSection = ({ routines }: { routines: SuccessStoryCardProps['post']['routines'] }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 2 }}>
      {routines.map((routine, index) => (
        <Box key={index} sx={{
          display: "flex",
          gap: theme.spacing(2),
          position: "relative",
          padding: theme.spacing(1),
          borderRadius: theme.shape.borderRadius,
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: theme.palette.success.light,
          },
        }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 0.5,
          }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
            }} />
            {index < routines.length - 1 && (
              <Box sx={{
                width: 2,
                height: 24,
                backgroundColor: theme.palette.grey[300],
                my: 0.5,
              }} />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="success.dark">
              {routine.time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {routine.content}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};