import _ from 'lodash'

export default function (Model) {
  return {
    create: (req, res, next) => {
      _.forEach(req.params, (value, key) => {
        if (value === '') req.params[key] = null
      })

      Model.create(req.params, function (error, entity) {
        if (error) return console.log(error)
        res.send(entity)
        next()
      })
    },

    read: async (req, res, next) => {
      var result
      var populateFields = _.values(Model.schema.paths)
        .filter((object) => object.path !== '_id' && object.instance === 'ObjectID' || object.instance === 'Array' && object.caster.instance === 'ObjectID')
        .map((object) => object.path)
        .join(' ')

      if (req.params.id) {
        result = await Model.findById(req.params.id).populate(populateFields) || ''
      } else {
        result = await Model.find().populate(populateFields)
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
