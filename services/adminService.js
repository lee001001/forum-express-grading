const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

// 傳給前端的資料
const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  }
}
module.exports = adminService
