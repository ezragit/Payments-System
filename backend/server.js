require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use('/api/payments', paymentRoutes);

// WebSocket Server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("Client Connected");
    socket.on("disconnect", () => console.log("Client Disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));
