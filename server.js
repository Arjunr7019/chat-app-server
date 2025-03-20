const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose")
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
dotenv.config({ path: './config.env' });

const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to match your frontend URL in production
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];
io.on("connection",(socket)=>{
    // console.log("newConnection", socket.id);

    socket.on("addNewUser",(userId)=>{
        !onlineUsers.some(user=> user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        })
        io.emit("getOnlineUsers",onlineUsers)
        // console.log("onlineUsers",onlineUsers);
    })

    //add message
    socket.on("sendMessage",(message)=>{
        const user = onlineUsers.find(user=> user.userId === message.recipientId);

        // console.log(message)

        if(user){
            io.to(user.socketId).emit("getMessage",message)
        }
    })

    socket.on("disconnect",()=>{
        onlineUsers = onlineUsers.filter(user=> user.socketId !== socket.id);

        io.emit("getOnlineUsers",onlineUsers)
    })
})

app.use(express.json())
app.use(cors())
app.use("/api/user", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

mongoose.connect(process.env.CON_STR, {
    useNewUrlParser: true
}).then((conn) => {
    // console.log(conn);
    console.log("DB connected successful");
}).catch((error) => {
    console.log(error);
})

app.get("/api", (req, res)=>{
    res.json("hello");
})
app.post("/api/test", (req, res)=>{
    res.json(req.body);
})

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });