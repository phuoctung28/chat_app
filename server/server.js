const express = require("express");
const dotenv = require("dotenv")
const routes = require("./routes")
const {chats} = require("./data/data")
const connectDB = require('./config/db')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors")
const bodyParser = require("express");
dotenv.config();
connectDB();
const app = express();
app.use(cors({
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.json()); // to accept json data
app.use("/api/", routes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT;


app.get('/', (req, res) => {
    res.send("API is running");
})
const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}`)
);
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});