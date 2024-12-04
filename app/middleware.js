const Category = require('./models/category')

module.exports = {
    checkLogin(req, res, next) {
        //console.log('checking for login')
        if (req.session && req.session.user) {
            return next()
        } else {
            res.render('pages/login', {
                errors: req.flash('errors')
            })
        }
    },

    async seedCategories(req, res, next) {
        const categories = [
            { name: 'Tech', user: req.session.user.username, entries: [
                {label: "Apple", apiQuery: "apple iphone ipad mac"},
                {label: "Tesla", apiQuery: "tesla car"}
            ] },
            { name: 'Business', user: req.session.user.username, entries: [
                {label: "Wall Street", apiQuery: "Wall Street AND finance"},
                {label: "Stocks", apiQuery: "stock market AND trading"},
                {label: "Bitcoin", apiQuery: "Bitcoin AND cryptocurrency"}
            ] },
            { name: 'World', user: req.session.user.username, entries: [
                {label: "Politics", apiQuery: "politics"},
                {label: "Conflicts", apiQuery: "conflicts"},
                {label: "Protests", apiQuery: "protests"},
                {label: "suprise Me!", apiQuery: "conflict OR war OR dispute"}
            ] }
        ]
    
        try {
            await Category.deleteMany({ user: req.session.user.username })
            for (category of categories) {
                let newCategory = new Category(category)
                await newCategory.save()
            }
        } catch (err) {
            console.log(err)
            res.status(500).send('Error seeding categories.');
        }
        
        if(next !== 'ignore') {
            return next()
        }
    }
}