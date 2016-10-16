import restify from 'restify'
import mongoose from 'mongoose'

import { getEvents, createEvent, updateEvent, deleteEvent } from './handlers/Event'
import { getGuests, postGuest } from './handlers/Guest'

var server = restify.createServer({
  name: 'hospital',
  version: '1.0.0'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

// var config = require('./config')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/hospital')

// Set up our routes and start the server
server.get('/events', getEvents)
server.get('/events/:id', getEvents)
server.post('/events', createEvent)
server.put('/events/:id', updateEvent)
server.del('/events/:id', deleteEvent)

server.get('/guests', getGuests)
server.post('/guests', postGuest)

server.listen(8080, () => console.log('%s listening at %s', server.name, server.url))
