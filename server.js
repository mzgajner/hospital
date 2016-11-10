import restify from 'restify'
import mongoose from 'mongoose'
import _ from 'lodash'

import Handlers from './handlers'
import { Payer, RoomType, Event, Transport, Room, Guest } from './models.js'

var server = restify.createServer({
  name: 'hospital',
  version: '1.0.0'
})

server.use(restify.fullResponse())
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

// var config = require('./config')
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hospital')

var entities = {
  payers: Payer,
  roomTypes: RoomType,
  events: Event,
  transports: Transport,
  rooms: Room,
  guests: Guest
}

_.each(entities, (model, url) => {
  var handlers = Handlers(model)
  server.get(`/api/${url}`, handlers.read)
  server.get(`/api/${url}/:id`, handlers.read)
  server.post(`/api/${url}`, handlers.create)
  server.put(`/api/${url}/:id`, handlers.update)
  server.del(`/api/${url}/:id`, handlers.del)
})

server.get(/\/guests/, restify.serveStatic({ directory: './client', file: 'index.html' }))
server.get(/\/events/, restify.serveStatic({ directory: './client', file: 'index.html' }))
server.get(/\/transports/, restify.serveStatic({ directory: './client', file: 'index.html' }))
server.get(/\/payers/, restify.serveStatic({ directory: './client', file: 'index.html' }))
server.get(/\/rooms/, restify.serveStatic({ directory: './client', file: 'index.html' }))
server.get(/\/roomTypes/, restify.serveStatic({ directory: './client', file: 'index.html' }))

server.get(/.*/, restify.serveStatic({
  directory: './client',
  default: 'index.html'
}))

server.listen(process.env.PORT || 8080, () => console.log('%s listening at %s', server.name, server.url))
