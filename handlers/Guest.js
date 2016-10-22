import _ from 'lodash'
import { Guest } from '../models'

export async function getGuests (req, res, next) {
  var result

  if (req.params.id) {
    result = await Guest.findById(req.params.id).populate('events') || ''
  } else {
    result = await Guest.find().populate('events')
  }

  res.send(result)
  next()
}

export async function updateGuest (req, res, next) {
  var guest = await Guest.findByIdAndUpdate(req.params.id, { $set: _.omit(req.params, 'id') }, { new: true })

  res.send(guest)
  next()
}

export async function deleteGuest (req, res, next) {
  await Guest.findByIdAndRemove(req.params.id)

  res.send(204)
  next()
}

export function postGuest (req, res, next) {
  var guest = new Guest(req.params)

  guest.save(function () {
    res.send(guest)
    next()
  })
}
