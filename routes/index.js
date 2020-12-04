const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController')

module.exports = (app, passport) => {
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
    }
    req.flash('error_messages', '請先登入')
    res.redirect('/signin')
  }

  // 如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

  // 在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // 前台餐廳餐廳單一路由 資料
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  // 前台餐廳評論路由
  app.post('/comments', authenticated, commentController.postComment)

  // 管理員刪除餐廳評論
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // 新建立User路由
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUsers)

  // 新建 user's profile 路由
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  // 建立 category 路由
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)
}
