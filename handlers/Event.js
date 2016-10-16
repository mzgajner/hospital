import mongoose from 'mongoose'
import _ from 'lodash'

var Event = mongoose.model('Event', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: String,
  date: Date,
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  }]
}))

function modifyEventReferencesOnGuests (addOrRemove, guestIds, eventIds) {
  var method = addOrRemove === 'add' ? 'push' : 'pull'
  var updateConfig = eventIds.length > 1 ? { [`$${method}All`]: { events: eventIds } } : { [`$${method}`]: { events: eventIds[0] } }

  return Promise.all(guestIds.map((id) =>
    mongoose.model('Guest').update({ _id: id }, updateConfig).exec()
  ))
}

export async function getEvents (req, res, next) {
  var result

  if (req.params.id) {
    result = await Event.findById(req.params.id).populate('participants') || ''
  } else {
    result = await Event.find().populate('participants')
  }

  res.send(result)
  next()
}

export async function createEvent (req, res, next) {
  var event = new Event()

  event._id = mongoose.Types.ObjectId()
  event.location = req.params.location
  event.date = req.params.date
  event.participants = req.params.participants

  await event.save()
  await modifyEventReferencesOnGuests('add', event.participants, event._id)

  res.send(event)
  next()
}

export async function updateEvent (req, res, next) {
  var event = await Event.findById(req.params.id)

  if (req.params.participants) {
    var participantsToRemove = _.without(event.participants, req.params.participants)
    var participantsToAdd = _.without(req.params.participants, event.participants)

    if (participantsToRemove.length > 0) {
      await modifyEventReferencesOnGuests('remove', participantsToRemove, [event._id])
    }
    if (participantsToAdd.length > 0) {
      await modifyEventReferencesOnGuests('add', participantsToAdd, [event._id])
    }
  }

  event = await Event.findByIdAndUpdate(req.params.id, { $set: _.omit(req.params, 'id') }, { new: true })

  res.send(event)
  next()
}

export async function deleteEvent (req, res, next) {
  var event = await Event.findByIdAndRemove(req.params.id)

  await modifyEventReferencesOnGuests('remove', event.participants, event._id)

  res.send()
  next()
}
