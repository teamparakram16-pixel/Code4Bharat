import { Box, Card, CardContent, Divider, Skeleton, Stack } from "@mui/material";

const PremiumPlanSkeleton: React.FC = () => (
  <Box
    sx={{
      width: { xs: "100%", sm: 320 },
      minHeight: 500,
      borderRadius: 3,
      boxShadow: "0 10px 25px -8px rgba(0,0,0,0.07)",
      background: "#f1f5f9",
      p: 2,
      mb: { xs: 3, sm: 0 },
    }}
  >
    <Card sx={{ background: "transparent", boxShadow: "none" }}>
      <CardContent>
        <Skeleton
          variant="rectangular"
          width="60%"
          height={32}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Skeleton width="90%" height={18} sx={{ mb: 1 }} />
        <Skeleton width="50%" height={18} sx={{ mb: 2 }} />
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Skeleton width="80%" />
          <Skeleton width="60%" />
          <Skeleton width="70%" />
        </Stack>
      </CardContent>
      <Box sx={{ p: 3, pt: 0 }}>
        <Skeleton width="70%" height={34} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  </Box>
);

export default PremiumPlanSkeleton;
