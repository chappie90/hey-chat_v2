module.exports = function(io) {
  io.on('connection', socket => {
    console.log('A user connected');
  
    // Disconnect from socket
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

