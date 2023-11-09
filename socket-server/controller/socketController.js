module.exports = (io, roomNum, getRandomTaunt) => {
    io.on('connection', (socket) => {
        // define current room Id
        let currentRoomId = 'room_' + roomNum;
        socket.join(currentRoomId);
        console.log(`${socket.id} has connected to ${currentRoomId}`);
    
        // increase roomNum if 2 clients are present in a room.
        if (io.sockets.adapter.rooms.get(currentRoomId) && io.sockets.adapter.rooms.size > 1) roomNum++;
    
        // decides the playerSign ('X' or 'O') of the player who just connected, emits it to the player.
        let playerSign = (io.sockets.adapter.rooms.get(currentRoomId).length > 1) ? 'O' : 'X';
        io.sockets.to(socket.id).emit('playerSign', playerSign)
    
        // notify everyone in the room that a player had just joined.
        io.sockets.in(currentRoomId).emit('connectToRoom', socket.id, currentRoomId, io.sockets.adapter.rooms.get(currentRoomId).sockets);
        console.log(`${currentRoomId} just joined`)
    
        // emit startGame event if there are enough players in this room
        if (io.sockets.adapter.rooms.get(currentRoomId).length > 1) {
        io.sockets.in(currentRoomId).emit('startGame');
        }
    
        // when a player disconnects from the game, notifies remaining player in the room
        socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected from ${currentRoomId}`);
        socket.broadcast.in(currentRoomId).emit('userLeft', socket.id);
        })
    
        // a player taunts their opponent
        socket.on('tauntOpponent', (opponentId) => {
        io.sockets.to(opponentId).emit('incomingTaunt', getRandomTaunt());
        })
    })
};