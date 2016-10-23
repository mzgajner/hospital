import _ from 'lodash'

export default function (Model) {
  return {
    create: (req, res, next) => {
      _.forEach(req.params, (value, key) => {
        if (value === '') req.params[key] = null
      })

      Model.create(req.params, function (error, entity) {
        if (error) {
          res.send(400, {
            message: error.message,
            errors: error.errors
          })
        } else {
          res.send(200, entity)
        }
        next()
      })
    },

    read: async (req, res, next) => {
      var result

      if (req.params.id) {
        result = await Model.findById(req.params.id) || ''
      } else {
        result = await Model.find()
      }

      res.send(result)
      next()
    },

    update: async (req, res, next) => {
      _.forEach(req.params, (value, key) => {
        if (value === '') req.params[key] = null
      })

      var entity = await Model.findByIdAndUpdate(req.params.id, { $set: _.omit(req.params, 'id') }, { new: true })

      res.send(entity)
      next()
    },

    del: async (req, res, next) => {
      await Model.findByIdAndRemove(req.params.id)

      res.send(204)
      next()
    }
  }
}
