const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Tạo ứng dụng Express
const app = express();
const server = http.createServer(app);

// Khởi tạo Socket.io với tùy chọn CORS cho phép mọi nguồn
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Lắng nghe kết nối từ client
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Khi client tạo phòng, tham gia room có key được gửi từ client
  socket.on("create-room", (roomKey) => {
    socket.join(roomKey);
    console.log(`Room created: ${roomKey} by ${socket.id}`);
    // Có thể gửi thông báo về cho chính client hoặc broadcast cho room
    io.to(roomKey).emit("room-updated", {
      status: "created",
      roomKey,
    });
  });

  socket.on("join-room", (roomKey) => {
    socket.join(roomKey);
    console.log(`Client ${socket.id} joined room ${roomKey}`);
    io.to(roomKey).emit("room-updated", {
      status: "joined",
      roomKey,
    });
  });

  // Sự kiện chọn agent (cho phần Agent Draft)
  socket.on("agent-selected", (data) => {
    // data: { roomKey, agent, team, turn }
    console.log(`Agent selected in room ${data.roomKey}:`, data);
    // Broadcast thông tin đã chọn cho tất cả client trong room
    io.to(data.roomKey).emit("agent-update", data);
  });

  // Sự kiện chọn/banning map (cho phần Map Draft)
  socket.on("map-selection", (data) => {
    // data: { roomKey, map, action, team, turn }
    console.log(`Map selection in room ${data.roomKey}:`, data);
    io.to(data.roomKey).emit("map-update", data);
  });

  // Bạn có thể bổ sung thêm các sự kiện khác nếu muốn
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Khởi chạy server trên cổng được chỉ định (mặc định 5000)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});