import { createServer } from 'http'
import { Server } from 'socket.io'

const server = createServer()

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  }
})

let relayEnabled = false

io.on('connection', (socket) => {
  const ip = socket.request.socket.remoteAddress

  console.log('new connection', ip)

  socket.on('set-enable-relay', (enabled) => {
    relayEnabled = enabled
    console.log('relayEnabled:', relayEnabled)
  })

  socket.on('update-status', (msg) => {
    if (!relayEnabled) return
    socket.broadcast.emit('update-status', msg)
    console.log('update-status:', msg);
  })
})

server.listen(process.env.PORT || 3000)