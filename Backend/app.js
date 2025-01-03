const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const adminRoutes = require("./routes/adminroutes");
// Import models
const Message = require("./models/messagemodele");
const Group = require('./models/groupmodele');
const User = require('./models/usermodele');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.send("home page");
});
app.use("/auth", authRoutes);
app.use("/userrouter",userRoutes);
app.use("/admin",adminRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});





/////////////////////////////...........

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Mongodb connected successfully!");
})
  .then(() => {
    const PORT = process.env.PORT;
    const server = app.listen(PORT, () =>
      console.log(`Server running on port "http://localhost:${PORT}"`)
    );

    // Initialize Socket.io
    const io = require("socket.io")(server, {
      cors: {
        origin: "*", // Your client URL
        methods: ['GET', 'POST']
      },
    });

    let onlineUsers = {};
    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      // Handle user online
      socket.on("userOnline", (userId) => {
        onlineUsers[userId] = socket.id;
        socket.emit("updateUserStatus", { userId, isOnline: true });
        console.log("Online :",userId)
      });

      // Handle sending messages
      socket.on("sendMessage", async (data) => {
        try {
          const senderId = data.senderId;
          const receiverId = data.receiverId;

          const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content: data.content,
            type: data.type
          });

          await message.save();
          // Emit to receiver if online
          const receiverSocket = onlineUsers[receiverId];
          if (receiverSocket) {
            io.to(receiverSocket).emit("receiveMessage", message);
            console.log("receiveMessage :", message)
          }else{
            console.error("receiveMessage is not working!")
          }
        } catch (error) {
          console.error("Error processing message:", error);
          socket.emit("error", { message: "Failed to process message", error: error.message });
        }
      });

      // Handle group messages
      socket.on('sendGroupMessage', async (data) => {
        const { senderId, groupId, content, type } = data;
        const message = new Message({ sender: senderId, group: groupId, content, type });
        await message.save();

        const group = await Group.findById(groupId).populate('members');
        group.members.forEach(member => {
          const memberSocket = onlineUsers[member._id];
          if (memberSocket) {
            io.to(memberSocket).emit('receiveGroupMessage', message);
          }
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        // Remove user from onlineUsers
        for (let userId in onlineUsers) {
          if (onlineUsers[userId] === socket.id) {
            delete onlineUsers[userId];
            io.emit("updateUserStatus", { userId, isOnline: false });
            break;
          }
        }
        console.log("Client disconnected");
      });
    });

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Upload routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/upload', uploadRoutes);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

