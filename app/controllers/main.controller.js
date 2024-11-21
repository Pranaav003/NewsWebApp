const Category = require('../models/category')
module.exports = {
    async showHomePage(req, res) {
        try {
            categories = await Category.find({})
   
            res.render('pages/newsDisplay', {
                categories: categories
            })
        } catch {
            res.status(404)
            res.send('categories not found')
        }
    }
}