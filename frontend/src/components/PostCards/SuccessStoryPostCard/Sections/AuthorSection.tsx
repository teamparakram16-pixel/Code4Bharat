import {
  Avatar,
  CardHeader,
  Typography,
  Tooltip,
  Box,
  IconButton,
} from "@mui/material";
import { AccessTime, MenuBook, MoreVert } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { VerificationBadge } from "./VerificationBadge";
import {
  SuccessStoryCardProps,
  VerificationDialogDataType,
} from "../SuccessStoryPostCard.types";

export const AuthorSection = ({
  post,
  verificationStatus,
  showVerifyActions,
  handleMenuOpen,
  handleVerify,
  handleMarkInvalid,
  handleVerifiersDialogOpen,
  verificationLoading,
}: {
  post: SuccessStoryCardProps["post"];
  verificationStatus: "verified" | "invalid" | "unverified";
  showVerifyActions: boolean;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleVerify: () => void;
  handleMarkInvalid: () => void;
  handleVerifiersDialogOpen: (
    verifiers: VerificationDialogDataType[],
    postTitle: string
  ) => void;
  verificationLoading: boolean;
}) => {
  return (
    <CardHeader
      avatar={
        <Avatar
          src={post.owner.profile.profileImage}
          sx={{
            width: 48,
            height: 48,
            border: "2px solid white",
            boxShadow: 1,
            "&:hover": {
              transform: "scale(1.1)",
              transition: "transform 0.3s",
            },
          }}
        >
          {post.owner.profile.fullName[0]}
        </Avatar>
      }
      action={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <VerificationBadge
            verificationStatus={verificationStatus}
            showVerifyActions={showVerifyActions}
            post={post}
            handleVerify={handleVerify}
            handleMarkInvalid={handleMarkInvalid}
            handleVerifiersDialogOpen={handleVerifiersDialogOpen}
            verificationLoading={verificationLoading}
          />
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ color: "grey.600" }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      }
      title={
        <Typography variant="subtitle1" fontWeight={600}>
          {post.owner.profile.fullName}
        </Typography>
      }
      subheader={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Tooltip title="Posted time" arrow>
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", color: "grey.600" }}
            >
              <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Tooltip>
          <Typography variant="caption" sx={{ color: "grey.400" }}>
            •
          </Typography>
          <Tooltip title="Reading time" arrow>
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", color: "grey.600" }}
            >
              <MenuBook fontSize="inherit" sx={{ mr: 0.5 }} />
              {post.readTime}
            </Typography>
          </Tooltip>
        </Box>
      }
      sx={{
        pb: 1,
        "& .MuiCardHeader-action": {
          alignSelf: "center",
        },
      }}
    />
  );
};
