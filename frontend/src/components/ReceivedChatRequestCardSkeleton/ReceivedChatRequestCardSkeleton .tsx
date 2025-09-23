import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const ReceivedChatRequestCardSkeleton: React.FC = () => (
  <Box>
    <Card>
      <CardContent>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </CardContent>
    </Card>
  </Box>
);

export default ReceivedChatRequestCardSkeleton;