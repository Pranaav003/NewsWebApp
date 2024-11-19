// routes/summarize.js
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller'),
    summarizeController = require('../app/controllers/summarizeController'),
    categoriesController = require('./controllers/categories.controller'),
    entriesController = require('./controllers/entries.controller')

module.exports = router;

//router.post('/', summarizeController.summarizeText);
router.post('/summarize', summarizeController.summarizeText);

//Main route
router.get('/', mainController.showHomePage)

//Category Modification
router.get('/categories', categoriesController.showCategories)
router.get('/categories/seed', categoriesController.seedCategories)
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
