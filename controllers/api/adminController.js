const db = require('../../models')
const Restaurant = db.Restaurant
// const Category = db.Category

const adminService = require('../../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res, callback) => {
    // 餐廳單一頁面看見分類
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
    // return Restaurant.findByPk(req.params.id)
    //   .then((restaurant) => {
    //     restaurant.destroy()
    //       .then((restaurant) => {
    //         res.json({ status: 'success', message: '' })
    //       })
    //   })
  }
}
module.exports = adminController
