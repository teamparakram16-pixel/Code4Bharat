import { config as dotEnvConfig } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotEnvConfig();
}

// import path from "path";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import bodyParser from "body-parser";
import errorHandler from "./utils/errorHandler.js";
import { cleanupTempFiles } from "./utils/cleanupTempFiles.js";
import chatRoutes from "./routes/chat.js";
import { Server } from "socket.io";

import successStoryRoute from "./routes/successStory.js";
import contactUsRoute from "./routes/contactUs.js";
import appointMent from "./routes/appointment.js"
import { Strategy as localStrategy } from "passport-local";
import Expert from "./models/Expert/Expert.js";
import User from "./models/User/User.js";

import userGoogleAuth from "./routes/auth/googleUserAuth.js";
import expertGoogleAuth from "./routes/auth/googleExpertAuth.js";
import expertEmailPasswordAuth from "./routes/auth/expertEmailPassowrdAuth.js";
import userEmailPasswordAuth from "./routes/auth/userEmailPasswordAuth.js";
import postRoute from "./routes/post.js";
import routinesRoute from "./routes/routines.js";
import expertRoute from "./routes/expert.js";
import userRoutes from "./routes/user.js";
import prakrathiRoutes from "./routes/prakrathi.js";
// import healthChallenge from "./routes/healthChallenge.js";
import commonAuthRouter from "./routes/auth/commonAuth.js";
import emailVerificationRouter from "./routes/auth/emailVerification.js";
import otpRouter from "./routes/auth/otp.js";

import passport from "passport";
import MongoStore from "connect-mongo";

import aiFeaturesRoute from "./routes/aiFeature.js";
import premiumRoute from "./routes/premium.js";

import Message from "./models/Message/Message.js";
import Chat from "./models/Chat/Chat.js";
import PremiumOption from "./models/PremiumOption/premiumOption.js";
import medicineRoutes from "./routes/medicine.js";
import connectToSocket from "./controllers/socketController.js";
import appointmentRoutes from "./routes/appointment.js";
const app = express();
const server = http.createServer(app);
main()
  .then(() => {
    console.log("DB connected successfully");

    // Initialize temporary files cleanup
    cleanupTempFiles(); // Run cleanup once at startup

    // Schedule cleanup every 24 hours
    setInterval(cleanupTempFiles, 24 * 60 * 60 * 1000);

    console.log("Temporary files cleanup scheduler initialized");
  })
  .catch((err) => {
    console.log("DB connect error");
    console.log(err.message);
  });

async function main() {
  await mongoose.connect(
    process.env.DB_URL || "mongodb://127.0.0.1:27017/ayurpath"
  );
}

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL || "mongodb://127.0.0.1:27017/ayurpath",
  crypto: {
    secret: process.env.SECRET || "My secret code",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error occurred in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "MySecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))

const corsOptions = {
  origin: ["https://arogyapaths.netlify.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "expert",
  new localStrategy({ usernameField: "email" }, Expert.authenticate())
);

passport.use(
  "user",
  new localStrategy({ usernameField: "email" }, User.authenticate())
);

passport.serializeUser((entity, done) => {
  done(null, { id: entity._id, type: entity.role });
});

passport.deserializeUser((obj, done) => {
  switch (obj.type) {
    case "expert":
      Expert.findById(obj.id).then((user) => {
        if (user) {
          done(null, user);
        } else {
          done(new Error("Client id not found: " + obj.id));
        }
      });
      break;
    case "user":
      User.findById(obj.id).then((user) => {
        if (user) {
          done(null, user);
        } else {
          done(new Error("Client id not found: " + obj.id));
        }
      });
      break;
    default:
      done(new Error("No entity type: " + obj.type));
      break;
  }
});

app.get("/", (req, res) => {
  res.json("Success");
});

app.get("/api/user/data", (req, res) => {
  res.status(200).json({
    userEmail: req.user.email,
  });
});

app.use("/api/ai", aiFeaturesRoute);

app.use("/api/auth", commonAuthRouter);
app.use("/api/auth/expert", expertEmailPasswordAuth);
app.use("/api/auth/user", userEmailPasswordAuth);
app.use("/api/auth/email", emailVerificationRouter);
app.use("/api/otp", otpRouter);

app.use("/api/auth/google/expert", expertGoogleAuth);
app.use("/api/auth/google/user", userGoogleAuth);

app.use("/api/posts", postRoute);
app.use("/api/success-stories", successStoryRoute);
app.use("/api/routines", routinesRoute);

app.use("/api/experts", expertRoute);
app.use("/api/users", userRoutes);

app.use("/api/prakrithi", prakrathiRoutes);
app.use("/api/medicines",medicineRoutes)
// app.use("/api/healthChallenge", healthChallenge);
app.use("/api/appointment",appointmentRoutes)
app.use("/api/chat", chatRoutes);

app.use("/api/premium", premiumRoute);
app.use("/api/contact", contactUsRoute);

// -------------------Deployment------------------//

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "local") {
//   app.use(express.static(path.join(__dirname1, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname1, "frontend", "dist", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.json("Success");
//   });
// }

// -------------------Deployment------------------//

app.use(errorHandler);

const port = process.env.PORT || 3000;
const io = connectToSocket(server);
 server.listen(port, () => {
  console.log("Server listening on port: ", port);
});



// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: ["http://localhost:5173", "https://arogyapaths.netlify.app"],
//   },
// });

// io.on("connection", (socket) => {
//   // Handle events from the client
//   socket.on("setup", (userData) => {
//     socket.user = userData;
//     socket.join(userData._id);
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//   });

//   // Handle chat messages
//   socket.on("chatMessage", async ({ message, chatId }) => {
//     const user = socket.user;

//     if (!user) {
//       socket.emit("error", "User not authenticated");
//       return;
//     }

//     const chat = await Chat.findById({
//       _id: chatId,
//       participants: { $elemMatch: { user: user._id } },
//     });

//     if (!chat) {
//       socket.emit("error", "Chat not found");
//       return;
//     }
//     const roomId = chatId;
//     const senderType = user.role === "expert" ? "Expert" : "User";
//     const senderId = user._id;

//     // Save message to MongoDB
//     const newMessage = new Message({
//       senderType: senderType,
//       sender: senderId,
//       content: message,
//       chat: roomId,
//     });

//     await newMessage.save();

//     chat.latestMessage = newMessage._id;
//     await chat.save();

//     // Emit to all clients in the room
//     io.to(roomId).emit("newMessage", {
//       _id: newMessage._id,
//       sender: {
//         _id: user._id,
//         profile: {
//           fullName: user.profile.fullName,
//           profilePicture: user.profile.profilePicture,
//         },
//       },
//       content: message,
//       createdAt: newMessage.createdAt,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });
