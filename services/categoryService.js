const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback(({
              categories: categories,
              category: category.toJSON()
            }))
          })
      } else {
        callback({ categories: categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    }
    Category.create({
      name: req.body.name
    })
      .then((category) => {
        // category 沒有使用到 但方便查看
        return callback({ status: 'success', message: 'category was successfully created' })
      })
  },
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              callback({ status: 'success', message: 'category was successfully updated' })
            })
        })
    }
  }
}
module.exports = categoryService
