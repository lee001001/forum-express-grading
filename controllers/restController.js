const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    // 有參數 offset 才起作用
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      // result.count 可以知道總共有幾筆資料
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      // clear up restaurants data

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      })
        .then(categories => { // 從 Category model 拿到資料
          return res.render('restaurants', {
            restaurants: data,
            categories: categories,
            categoryId: categoryId,
            page: page,
            totalPage: totalPage,
            prv: prev,
            next: next
          })
        })
    })
  },
  // 單一餐廳的資訊
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,

        { model: User, as: 'FavoritedUsers' }, // 加入關聯資料
        {
          model: Comment, include: [User]
        }]
    }).then(restaurant => {
      restaurant.viewCounts += 1
      restaurant.save().then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited: isFavorited
        })
      })
    })
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },
  getDashboard: (req, res) => {
    // step1: 先尋找餐廳id,尋找單一餐廳資料
    const RestaurantId = req.params.id
    return Restaurant.findByPk(RestaurantId, {
      include: [
        Category,
        {
          model: Comment, include: [User]
        }]
    })
      .then(restaurant => {
        // 進入到 Comment 找到 自己RestaurantId的次數
        res.render('dashboard', {
          restaurant: restaurant.toJSON()
        })
      })
  }
}

module.exports = restController
