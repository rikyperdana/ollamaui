module.exports = app => app.of('/ollama')
  .on('connection', socket => [
    socket.on('test', (data, cb) => cb(data))
  ])
