module.exports = (app, Ollama) => app.of('/ollama')
  .on('connection', socket => [
    socket.on('test', (data, cb) => cb(data)),
    socket.on('aski', (data, cb) => Ollama.chat(data)
      .then(resp => resp.message.content)
    ),
    socket.on('ask', (data, cb) => {
      Ollama.chat(data).then(cb)
    })
  ])
