const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { ObjectId } = mongoose.Types;

dotenv.config();

const app = express();
// app.use(cors({
//   origin: 'hhtp://localhost:5173', // Update to your frontend URL
//   methods: ['GET', 'POST'],
// }));
// app.use(cors());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.send("home page");
});
app.use("/auth", authRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Mongodb connected successfully!");
})
  .then(() => {
    const PORT = process.env.PORT;
    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );

    // Initialize Socket.io
    const io = require("socket.io")(server, {
      cors: {
        origin: "*", // Your client URL
        methods: ['GET', 'POST' ,'DELETE']
      },
    });

    // Import models
    const Message = require("./models/messagemodele");
    const Group = require('./models/groupmodele');

    let onlineUsers = {}
    io.on("connection", (socket) => {
      console.log("New client connected",socket.id);

      // Handle user online
      socket.on("userOnline", (userId) => {
        onlineUsers[userId] = socket.id;
        socket.emit("updateUserStatus", { userId, isOnline: true });
        console.log("hello: ",userId)
      });

      // Handle sending messages
      socket.on("sendMessage", async (data) => {
        try {
          if (!isValidObjectId(data.senderId) || !isValidObjectId(data.receiverId)) {
            console.log("Invalid ObjectId format.");
          }

          const senderId = data.senderId;
          const receiverId = data.receiverId
          
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
          }
        } catch (error) {
          console.error("Error processing message:", error);
          // socket.emit("error", { message: "Failed to process message", error: error.message });
        }
      });

      // Handle group messages
      io.on('sendGroupMessage', async (data) => {
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
  })
  .catch((err) => console.log(err));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Upload routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

