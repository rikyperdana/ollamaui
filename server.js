const
io      = require('socket.io'),
express = require('express'),
userAPI = require('./deps/user.js'),
crudAPI = require('./deps/crud.js'),
ollamaAPI = require('./deps/ollama.js')

app = express()
  .use(express.static('public'))
  .listen(3000),

IO = io(app)
userAPI(IO)
crudAPI(IO) // prototyping purpose only

import('ollama').then(
  ({Ollama}) => ollamaAPI(IO, new Ollama)
)
