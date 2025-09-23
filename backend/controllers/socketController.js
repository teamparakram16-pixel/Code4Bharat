import { Server } from "socket.io";
import Chat from "../models/Chat/Chat.js";
import Message from "../models/Message/Message.js";

let connections = {}; // WebRTC rooms
let messages = {};    // In-call chat messages
let timeOnline = {};  // WebRTC users join time

const connectToSocket = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: ["http://localhost:5173", "https://arogyapaths.netlify.app"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // ================== WebRTC / Video Call ==================
        socket.on("join-call", (roomName) => {
            if (!connections[roomName]) connections[roomName] = [];
            connections[roomName].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[roomName].forEach((id) => {
                if (id !== socket.id) io.to(id).emit("user-joined", socket.id);
            });

            const existingUsers = connections[roomName].filter((id) => id !== socket.id);
            io.to(socket.id).emit("existing-users", existingUsers);

            if (messages[roomName]) {
                messages[roomName].forEach((msg) => {
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg.socketId);
                });
            }
        });

        socket.on("signal", (toId, data) => {
            io.to(toId).emit("signal", socket.id, data);
        });

        socket.on("chat-message", (data, sender) => {
            let userRoom = null;
            for (let room in connections) {
                if (connections[room].includes(socket.id)) {
                    userRoom = room;
                    break;
                }
            }
            if (!userRoom) return;

            if (!messages[userRoom]) messages[userRoom] = [];
            messages[userRoom].push({ sender, data, socketId: socket.id });

            connections[userRoom].forEach((id) => {
                if (id !== socket.id) io.to(id).emit("chat-message", data, sender);
            });
        });

        // ================== Chat / Messaging ==================
        socket.on("setup", (userData) => {
            socket.user = userData;
            socket.join(userData._id);
        });

        socket.on("join chat", (room) => {
            socket.join(room);
        });

        socket.on("chatMessage", async ({ message, chatId }) => {
            const user = socket.user;
            if (!user) return socket.emit("error", "User not authenticated");

            const chat = await Chat.findById({
                _id: chatId,
                participants: { $elemMatch: { user: user._id } },
            });
            if (!chat) return socket.emit("error", "Chat not found");

            const senderType = user.role === "expert" ? "Expert" : "User";
            const senderId = user._id;

            const newMessage = new Message({
                senderType,
                sender: senderId,
                content: message,
                chat: chatId,
            });

            await newMessage.save();

            chat.latestMessage = newMessage._id;
            await chat.save();

            io.to(chatId).emit("newMessage", {
                _id: newMessage._id,
                sender: {
                    _id: user._id,
                    profile: {
                        fullName: user.profile.fullName,
                        profilePicture: user.profile.profilePicture,
                    },
                },
                content: message,
                createdAt: newMessage.createdAt,
            });
        });

        // ================== Disconnect ==================
        socket.on("disconnect", () => {
            // WebRTC cleanup
            let userRoom = null;
            for (let room in connections) {
                if (connections[room].includes(socket.id)) {
                    userRoom = room;
                    break;
                }
            }

            if (userRoom) {
                connections[userRoom].forEach((id) => {
                    if (id !== socket.id) io.to(id).emit("user-left", socket.id);
                });

                connections[userRoom] = connections[userRoom].filter((id) => id !== socket.id);
                if (connections[userRoom].length === 0) delete connections[userRoom];
            }

            // Chat cleanup (optional) + better logging
            console.log(`Socket ${socket.id} disconnected`);
            if (socket.user) console.log(`Chat user: ${socket.user._id} left`);

            delete timeOnline[socket.id];
        });

    });

    return io;
};

export default connectToSocket;
