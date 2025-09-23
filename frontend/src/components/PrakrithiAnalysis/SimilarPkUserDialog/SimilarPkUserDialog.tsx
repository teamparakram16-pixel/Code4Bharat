import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { X as Close, MessageCircle as Chat, Loader2 } from "lucide-react";
import { SimilarPkUserDialogProps } from "./SimilarPkUserDialog.types";
import useChat from "@/hooks/useChat/useChat";
import {
  ChatRequestData,
  ChatRequestUser,
} from "@/hooks/useChat/useChat.types";

const SimilarPkUserDialog: React.FC<SimilarPkUserDialogProps> = ({
  open,
  onClose,
  similarPkUsers,
  createChatLoad,
  similarPkUserMessage,
}) => {
  const { sendChatRequest } = useChat();
  const [groupMode, setGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupError, setGroupError] = useState("");
  const [sending, setSending] = useState<string>("");
  // Track which users have had a chat request sent (private or group)
  const [sentSentPrivateRequests, setSentPrivateRequests] = useState<string[]>(
    []
  ); // user ids for private, group: 'group'
  const [_groupRequestSent, setGroupRequesSent] = useState<boolean>(false);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendGroupChatRequest = async () => {
    try {
      if (!groupName.trim()) {
        setGroupError("Group name is required");
        return;
      }
      if (selectedUsers.length < 2) {
        setGroupError("Select at least 2 users for a group chat");
        return;
      }
      setGroupError("");
      setSending("group");
      const users: ChatRequestUser[] = selectedUsers.map((id) => ({
        user: id,
        userType: "User",
      }));
      const data: ChatRequestData = {
        chatType: "group",
        groupName,
        users,
        chatReason: { similarPrakrithi: true },
      };
      await sendChatRequest(data);
      setSending("");

      setSelectedUsers([]);
      setGroupName("");
      // setGroupMode(false);
      setGroupRequesSent(true);
      // onClose();
    } catch (error) {
      console.error("Error sending group chat request:", error);
      setGroupError("Failed to send group chat request. Please try again.");
    } finally {
      setSending("");
    }
  };

  const handleSendPrivateChatRequest = async (userId: string) => {
    try {
      setSending(userId);
      const data: ChatRequestData = {
        chatType: "private",
        users: [{ user: userId, userType: "User" }],
        chatReason: { similarPrakrithi: true },
      };
      await sendChatRequest(data);
      setSending("");
      setSentPrivateRequests((prev) => [...prev, userId]);
      // onClose();
    } finally {
      setSending("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-between items-center">
        <span>People with Similar Prakriti</span>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {similarPkUsers.length >1 && (
          <div className="flex justify-end mb-2">
            <Button
              variant={groupMode ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setGroupMode((prev) => !prev);
                setSelectedUsers([]);
                setGroupName("");
                setGroupError("");
                setGroupRequesSent(false);
              }}
              size="small"
            >
              {groupMode ? "Cancel Group" : "Group"}
            </Button>
          </div>
        )}

        {similarPkUsers.length === 0 ? (
          <Typography variant="body2" className="text-center text-gray-500">
            {similarPkUserMessage || "No similar Prakriti users found."}
          </Typography>
        ) : (
          <>
            <Typography variant="body1" className="mb-4 text-center">
              <span className="font-bold text-teal-600">
                {similarPkUsers.length}
              </span>
              of people share similar Prakriti with you
            </Typography>
            <div className="space-y-4">
              {similarPkUsers.map((eachPkUser) => (
                <div
                  key={eachPkUser.user._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {groupMode && (
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(eachPkUser.user._id)}
                        onChange={() => handleUserSelect(eachPkUser.user._id)}
                        className="mr-2"
                      />
                    )}
                    <Avatar
                      src={eachPkUser.user.profile.profileImage}
                      alt={eachPkUser.user.profile.fullName}
                    />
                    <div>
                      <Typography variant="subtitle1">
                        {eachPkUser.user.profile.fullName}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        {eachPkUser.similarityPercentage}%
                      </Typography>
                    </div>
                  </div>
                  {!groupMode && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Chat />}
                      onClick={() =>
                        handleSendPrivateChatRequest(eachPkUser.user._id)
                      }
                      size="small"
                      disabled={
                        sending.includes(eachPkUser.user._id) ||
                        createChatLoad ||
                        sentSentPrivateRequests.includes(eachPkUser.user._id)
                      }
                    >
                      {sentSentPrivateRequests.includes(eachPkUser.user._id) ? (
                        "Chat Request Sent"
                      ) : sending.includes(eachPkUser.user._id) ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Chat"
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {groupMode && (
              <div className="mt-6 space-y-2">
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {groupError && (
                  <Typography color="error" variant="body2">
                    {groupError}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={
                    sending === "group" ||
                    createChatLoad ||
                    selectedUsers.length < 2
                  }
                  onClick={handleSendGroupChatRequest}
                  startIcon={<Chat />}
                >
                  {sentSentPrivateRequests ? (
                    "Chat Request Sent"
                  ) : sending === "group" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Send Chat Request"
                  )}
                </Button>
                <Typography variant="caption" color="textSecondary">
                  (Select at least 2 users for a group chat)
                </Typography>
              </div>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimilarPkUserDialog;
