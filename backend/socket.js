// // socket.js
// import Chat from "./models/Chat/Chat.js";

// export default (io) => {
//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     // Join a specific room for a conversation between two users
//     socket.on("joinRoom", ({ senderId, receiverId }) => {
//       const roomId = [senderId, receiverId].sort().join("_");
//       socket.join(roomId);
//       console.log(`User ${senderId} joined room ${roomId}`);
//     });

//     // Handle chat messages
//     socket.on("chatMessage", async ({ senderId, receiverId, message }) => {
//       const roomId = [senderId, receiverId].sort().join("_");

//       // Save message to MongoDB
//       const newMessage = new Chat({
//         sender: senderId,
//         receiver: receiverId,
//         message,
//       });
//       await newMessage.save();

//       // Emit to all clients in the room
//       io.to(roomId).emit("newMessage", {
//         senderId,
//         message,
//         timestamp: newMessage.timestamp,
//       });

//       console.log(`Message sent from ${senderId} to ${receiverId} in room ${roomId}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };
