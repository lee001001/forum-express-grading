const express = require('express')
const router = express.Router()

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController')

const passport = require('../config/passport')

const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 檢查使用者是否登入。如果沒有就導回登入頁
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
// 檢查使用者是否為管理者身份
const authenticatedAdmin = (req, res, next) => {
  // if(req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).id === Number(req.params.id)) return next()
    return res.redirect('back')
  }
  res.redirect('/signin')
}

// 如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
// 在 /restaurants 則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// 人氣餐廳
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
// 前台餐廳餐廳單一路由 資料
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// 前台餐廳評論路由
router.post('/comments', authenticated, commentController.postComment)
// 管理員刪除餐廳評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.unLike)

// 美食達人路由
router.get('/users/top', authenticated, userController.getTopUser)

router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticatedUser, userController.editUser)
router.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// 新建立User路由

router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUsers)

// 建立 category 路由
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router
