const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose")
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
dotenv.config({ path: './config.env' });

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

app.listen(5000, ()=> {console.log('Server started on port 5000')})