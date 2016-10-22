import restify from 'restify'
import mongoose from 'mongoose'

import { getEvents, createEvent, updateEvent, deleteEvent } from './handlers/Event'
import { getGuests, postGuest, updateGuest, deleteGuest } from './handlers/Guest'
import { getPayers, postPayer, updatePayer, deletePayer } from './handlers/Payer'

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
mongoose.connect('mongodb://localhost/hospital')

// Set up our routes and start the server
server.get('/events', getEvents)
server.get('/events/:id', getEvents)
server.post('/events', createEvent)
server.put('/events/:id', updateEvent)
server.del('/events/:id', deleteEvent)

server.get('/guests', getGuests)
server.get('/guests/:id', getGuests)
server.post('/guests', postGuest)
server.put('/guests/:id', updateGuest)
server.del('/guests/:id', deleteGuest)

server.get('/payers', getPayers)
server.get('/payers/:id', getPayers)
server.post('/payers', postPayer)
server.put('/payers/:id', updatePayer)
server.del('/payers/:id', deletePayer)

server.listen(8080, () => console.log('%s listening at %s', server.name, server.url))
