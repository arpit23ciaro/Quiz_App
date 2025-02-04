export const initializeSocket = (io) => {
    let rooms = {};
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        io.to(socket.id).emit("get-user-id", socket.id);
        socket.on("create-room", (roomId) => {
            socket.join(roomId);
            rooms[roomId] = { host: socket.id, users: [] };
        });
        socket.on("question-data", ({ roomId, questionInfo }) => {
            io.to(roomId).emit("update-question", questionInfo);
        });
        socket.on("timerEnded", ({ roomId }) => {
            var _a;
            const sortedUser = (_a = rooms[roomId]) === null || _a === void 0 ? void 0 : _a.users;
            sortedUser === null || sortedUser === void 0 ? void 0 : sortedUser.sort((a, b) => b.score - a.score);
            io.to(roomId).emit("score-card", sortedUser);
        });
        socket.on("join-room", ({ roomId, username, imageUrl }) => {
            if (rooms[roomId]) {
                const user = { id: socket.id, username, imageUrl, score: 0 };
                rooms[roomId].users.push(user);
                socket.join(roomId);
                io.to(rooms[roomId].host).emit("update-user-list", rooms[roomId].users);
            }
        });
        socket.on("update-user", ({ roomId, userId, score }) => {
            rooms[roomId].users = rooms[roomId].users.map((user) => user.id == userId ? Object.assign(Object.assign({}, user), { score: user.score + score }) : user);
        });
        socket.on("disconnect", () => {
            for (const roomId in rooms) {
                const room = rooms[roomId];
                const userIndex = room.users.findIndex((user) => user.id === socket.id);
                if (userIndex !== -1) {
                    room.users.splice(userIndex, 1);
                    io.to(room.host).emit("update-user-list", room.users);
                    console.log(`User ${socket.id} left room: ${roomId}`);
                }
                if (room.host === socket.id) {
                    io.to(roomId).emit("room-closed");
                    delete rooms[roomId];
                    console.log(`Host ${socket.id} closed room: ${roomId}`);
                }
            }
        });
    });
};
