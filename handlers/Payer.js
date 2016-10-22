import _ from 'lodash'
import { Payer } from '../models'

export async function getPayers (req, res, next) {
  var result

  if (req.params.id) {
    result = await Payer.findById(req.params.id) || ''
  } else {
    result = await Payer.find()
  }

  res.send(result)
  next()
}

export async function updatePayer (req, res, next) {
  var payer = await Payer.findByIdAndUpdate(req.params.id, { $set: _.omit(req.params, 'id') }, { new: true })

  res.send(payer)
  next()
}

export async function deletePayer (req, res, next) {
  await Payer.findByIdAndRemove(req.params.id)

  res.send(204)
  next()
}

export function postPayer (req, res, next) {
  var payer = new Payer(req.params)

  payer.save(function () {
    res.send(payer)
    next()
  })
}
