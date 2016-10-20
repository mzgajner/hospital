import mongoose from 'mongoose'

var Guest = mongoose.model('Guest', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
}))

export function getGuests (req, res, next) {
  Guest
    .find()
    .populate('events')
    .exec(function (arr, data) {
      res.send(data)
      next()
    })
}

export function updateGuest () {}

export async function deleteGuest (req, res, next) {
  await Guest.findByIdAndRemove(req.params.id)

  res.send(204)
  next()
}

export function postGuest (req, res, next) {
  var guest = new Guest()

  guest._id = mongoose.Types.ObjectId()
  guest.name = req.params.name
  guest.events = req.params.events

  guest.save(function () {
    res.send(guest)
    next()
  })
}
