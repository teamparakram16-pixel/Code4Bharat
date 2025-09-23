import { Box, Button, Tooltip } from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";
import { Loader2 } from "lucide-react";
import { SuccessStoryType } from "@/types/SuccessStory.types";
import { VerificationDialogDataType } from "../SuccessStoryPostCard.types";

export const VerificationBadge = ({
  verificationStatus,
  showVerifyActions,
  post,
  verificationLoading,
  handleVerify,
  handleMarkInvalid,
  handleVerifiersDialogOpen,
}: {
  verificationStatus: "verified" | "invalid" | "unverified";
  showVerifyActions: boolean;
  post: SuccessStoryType;
  verificationLoading: boolean;
  handleVerify: () => void;
  handleMarkInvalid: () => void;
  handleVerifiersDialogOpen: (
    verifiers: VerificationDialogDataType[],
    postTitle: string
  ) => void;
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {post.verifyAuthorization ? (
        <Tooltip
          title="Not yet verified by you. Click to verify or mark invalid."
          arrow
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              borderRadius: 1,
              backgroundColor: "grey.200",
              color: "grey.600",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginRight: 1,
              cursor: "pointer",
              "& svg": {
                marginRight: "4px",
                fontSize: "1rem",
              },
            }}
          >
            <Warning fontSize="small" />
            Please verify
          </Box>
        </Tooltip>
      ) : (
        <>
          {post.verified.length + post.rejections.length > 0 && (
            <>
              {post.verified.length > 0 && (
                <Tooltip title="Verified by medical professionals" arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: 1,
                      backgroundColor: "success.light",
                      color: "success.dark",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginRight: 1,
                      cursor: "pointer",
                      "& svg": {
                        marginRight: "4px",
                        fontSize: "1rem",
                      },
                    }}
                    onClick={() =>
                      handleVerifiersDialogOpen(post.verified, post.title)
                    }
                  >
                    <CheckCircle fontSize="small" />
                    Verified
                  </Box>
                </Tooltip>
              )}

              {post.rejections.length > 0 && (
                <Tooltip title={`Invalid post:`} arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: 1,
                      backgroundColor: "error.light",
                      color: "error.dark",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginRight: 1,
                      "& svg": {
                        marginRight: "4px",
                        fontSize: "1rem",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleVerifiersDialogOpen(post.rejections, post.title)
                    }
                  >
                    <Warning fontSize="small" />
                    Invalid
                  </Box>
                </Tooltip>
              )}
            </>
          )}

          {verificationStatus === "verified" && <p>Verfied by you</p>}

          {verificationStatus === "invalid" && <p>Rejected By you</p>}

          {post.verified.length + post.rejections.length === 0 && (
            <Tooltip title="Not yet verified by medical professionals" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  borderRadius: 1,
                  backgroundColor: "grey.200",
                  color: "grey.600",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginRight: 1,
                  "& svg": {
                    marginRight: "4px",
                    fontSize: "1rem",
                  },
                }}
              >
                <Warning fontSize="small" />
                Unverified
              </Box>
            </Tooltip>
          )}
        </>
      )}
      {post.verifyAuthorization && showVerifyActions && (
        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
          <Button
            variant="outlined"
            size="small"
            color="success"
            startIcon={
              verificationLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle />
              )
            }
            onClick={handleVerify}
            disabled={verificationLoading}
          >
            Verify
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={
              verificationLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Warning />
              )
            }
            onClick={handleMarkInvalid}
            disabled={verificationLoading}
          >
            Mark Invalid
          </Button>
        </Box>
      )}
    </Box>
  );
};
