const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    // 餐廳單一頁面看見分類
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          return res.render('admin/create', {
            categories: categories,
            restaurant: restaurant.toJSON()
          })
        })
    })
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
    // return Restaurant.findByPk(req.params.id)
    //   .then((restaurant) => {
    //     restaurant.destroy()
    //       .then((restaurant) => {
    //         res.redirect('/admin/restaurants')
    //       })
    //   })
  },
  // Get ALl users
  getUsers: (req, res) => {
    User.findAll({ raw: true }).then(users => {
      res.render('admin/users', { users: users })
    })
  },
  putUsers: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        return user.update({ isAdmin: !user.isAdmin })
      })

      .then(users => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect('/admin/users')
      })
  }

}

module.exports = adminController
