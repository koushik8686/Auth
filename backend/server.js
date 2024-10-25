const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);  // Attach Express to HTTP server
const port = 4000;
const cors = require('cors');
const messageModel = require('./models/messagemodel');
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.URL || "mongodb://127.0.0.1:27017/bitnbuild", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO on the same server as Express
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

  // User joins a room based on their startupid from cookies
  socket.on('joinRoom', (roomid) => {
    socket.join(roomid); // Join the room with startupid
    console.log(`User ${socket.id} joined room ${roomid}`);
  });
  
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });
  
  // Listen for messages from users in the room
  socket.on('sendMessage', async ({ roomId, messageData }) => {
    console.log("Message received from user in room:", roomId, messageData);
    try {
      // Emit message to all clients in the room
      io.to(roomId).emit('receiveMessage', messageData);
      console.log(`Message sent to room ${roomId}:`, messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    try {
        const existingMessages = await messageModel.findOne({ _id: roomId });

        console.log(existingMessages, messageData); 
        // If messages exist, push the new message to the messages array
        existingMessages.messages.push({
          message: messageData.message,
          sender: messageData.sender,
          type: messageData.type, // This assumes `type` is part of the messageData, otherwise remove it
        });
        
        await existingMessages.save();  
      console.log("Message saved to database.");
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  });

  // Broadcast message to all clients
  socket.on('BroadcastMessage', async ({ messageData }) => {
    console.log("Broadcasting message:", messageData);
    try {
      // Emit broadcast message to all connected clients
      io.emit('receiveMessage', messageData);
      console.log("Broadcast message sent to all clients:", messageData);
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }

    // Save broadcast message to database for all startups
    try {
      const allStartups = await startupModel.find();  // Assuming startupModel exists
      if (allStartups && allStartups.length > 0) {
        for (let startup of allStartups) {
          const roomId = startup._id; // Assuming _id is the unique identifier for startup
          const existingMessages = await messageModel.findOne({ startup_id: roomId });
          if (existingMessages) {
            existingMessages.messages.push({
              message: messageData.message,
              sender: messageData.sender,
              created_at: new Date(),
            });
            await existingMessages.save(); // Save updated document
          } else {
            const newMessage = new messageModel({
              startup_id: roomId,
              messages: [{
                message: messageData.message,
                sender: messageData.sender,
                created_at: new Date(),
              }],
            });
            await newMessage.save(); // Save new document
          }
          console.log(`Message saved to database for startup ${roomId}.`);
        }
      } else {
        console.log("No startups found.");
      }
    } catch (error) {
      console.error("Error saving broadcast message to database:", error);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Express routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/user', require("./routers/user/data"));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use("/auth", require("./routers/user/auth"));

// Start the server using `server.listen` instead of `app.listen`
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
