// routes/summarize.js
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller'),
    summarizeController = require('./controllers/summarizeController'),
    categoriesController = require('./controllers/categories.controller'),
    entriesController = require('./controllers/entries.controller'),
    middleware = require('./middleware')

module.exports = router;

//router.post('/', summarizeController.summarizeText);
router.post('/summarize', summarizeController.summarizeText);

//Main routes
router.get('/', mainController.showHomePage)
router.get('/showLogin', mainController.showLogin)
router.get('/showSignUp', mainController.showSignUp)
router.post('/login', mainController.login)
router.post('/signUp', mainController.signUp)
router.get('/logOut', mainController.logOut)
router.post('/search', mainController.search)
router.get('/clearSearches', mainController.clearSearches)
router.get('/deleteAccount', mainController.deleteAccount)

//Category Modification
router.get('/categories', categoriesController.showCategories)
router.get('/categories/seed', middleware.seedCategories, categoriesController.showCategories)
router.get('/categories/showCreate', categoriesController.showCreate)
router.get('/categories/:slug/view', categoriesController.viewCategory)
router.get('/categories/:slug/delete', categoriesController.deleteCategory)
router.get('/categories/:slug/showEditCategory', categoriesController.showEditCategory)
router.get('/categories/deleteAll', categoriesController.deleteAll) 

router.post('/categories/:slug/processEditCategory', categoriesController.processEditCategory)
router.post('/categories/create', categoriesController.processCreateCategory)

//Category Entry Modification
router.get('/categories/:slug/:_id/delete', entriesController.deleteEntry)
router.get('/categories/:slug/showCreateEntry', entriesController.showCreateEntry)
router.get('/categories/:slug/:_id/showEdit', entriesController.showEditEntry)

router.post('/categories/:slug/processCreateEntry', entriesController.processCreateEntry)
router.post('/categories/:slug/:_id/processEditEntry', entriesController.processEditEntry)
