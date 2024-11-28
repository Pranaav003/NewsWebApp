const Category = require('../models/category')
const categoriesController = require('./categories.controller')

module.exports = {
    async showHomePage(req, res) {
        try {
            let categories = await Category.find({})
            if(!categories || categories.length === 0) {
                await categoriesController.seedCategories(req, 'ignore')
                categories = await Category.find({})
            }
            
            res.render('pages/newsDisplay', {
                categories: categories
            })
        } catch {
            res.status(404)
            res.send('Categories not found!')
        }
    }
}