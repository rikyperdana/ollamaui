module.exports = (app, Ollama) =>
  app.of('/ollama')
  .on('connection', socket =>
    socket.on('ask', (data, cb) =>
      Ollama.chat(data).then(cb)
    )
  )
