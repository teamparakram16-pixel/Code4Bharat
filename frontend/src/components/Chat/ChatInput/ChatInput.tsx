import { FC } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ChatInputProps } from "./ChatInput.types";

const sendMessageInputSchema = z.object({
  msg: z.string().min(1),
});

export const ChatInput: FC<ChatInputProps> = ({
  chatId,
  currUser,
  socket,
  sendMessage,
}) => {
  const form = useForm<z.infer<typeof sendMessageInputSchema>>({
    resolver: zodResolver(sendMessageInputSchema),
    defaultValues: {
      msg: "",
    },
  });

  const handleSubmits = async (
    data: z.infer<typeof sendMessageInputSchema>
  ) => {
    if (!socket) {
      toast.error("Socket not connected");
      return;
    }

    if (!chatId) {
      toast.error("Chat ID missing");
      return;
    }

    if (!currUser) {
      toast.error("Current user not found");
      return;
    }

    const message = data.msg.trim();
    if (!message) return;

    sendMessage(message);

    form.reset();
  };

  return (
    <Paper
      component="form"
      onSubmit={form.handleSubmit(handleSubmits)}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type a message..."
        {...form.register("msg")}
        multiline
        maxRows={4}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="send">
        <Send size={20} />
      </IconButton>
    </Paper>
  );
};
