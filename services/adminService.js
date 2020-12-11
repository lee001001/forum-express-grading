const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

// 傳給前端的資料
const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    // 餐廳單一頁面看見分類
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      //  console.log(restaurant.toJSON())
      //  console.log(restaurant)
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService
