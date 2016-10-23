import mongoose from 'mongoose'

export const Payer = mongoose.model('Payer', new mongoose.Schema({
  name: String
}))

export const RoomType = mongoose.model('RoomType', new mongoose.Schema({
  hotel: String,
  size: Number,
  price: Number
}))

export const Event = mongoose.model('Event', new mongoose.Schema({
  name: String,
  location: String,
  date: Date
}))

export const Transport = mongoose.model('Transport', new mongoose.Schema({
  type: {
    type: String,
    enum: ['Plane', 'Train', 'Bus', 'Car']
  },
  ticketId: String,
  time: Date,
  pickup: {
    type: String,
    enum: ['Animateka', 'GoOpti', 'Own/None']
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payer'
  }
}))

export const Room = mongoose.model('Room', new mongoose.Schema({
  name: String,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType'
  }
}))

export const Guest = mongoose.model('Guest', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  country: String,
  organisation: String,
  arrival: {
    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transport'
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payer'
    }
  },
  departure: {
    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transport'
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payer'
    }
  },
  accommodation: {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payer'
    }
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
}))
