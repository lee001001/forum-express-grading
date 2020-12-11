const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback, next) => {
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
          .catch(err => next(err))
      } else {
        callback({ categories: categories })
      }
    })
      .catch(err => next(err))
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    Category.create({
      name: req.body.name
    })
      .then(() => {
        // category 沒有使用到 但方便查看
        return callback({ status: 'success', message: 'category was successfully created' })
      })
  }

}
module.exports = categoryService
