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
mongoose.connect(process.env.MONGODB_URI)

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
  server.get(`/${url}`, handlers.read)
  server.get(`/${url}/:id`, handlers.read)
  server.post(`/${url}`, handlers.create)
  server.put(`/${url}/:id`, handlers.update)
  server.del(`/${url}/:id`, handlers.del)
})

server.listen(8080, () => console.log('%s listening at %s', server.name, server.url))
