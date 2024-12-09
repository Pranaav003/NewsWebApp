const Category = require('./models/category')

module.exports = {
    checkLogin(req, res, next) {
        //console.log('checking for login')
        if (req.session && req.session.user) {
            return next()
        } else {
            res.redirect('/frontpage.html')
        }
    },

    async seedCategories(req, res, next) {
        const categories = [
            { name: 'Tech', user: req.session.user.username, entries: [
            {label: "Apple", apiQuery: "apple AND iphone"},
            {label: "Tesla", apiQuery: "tesla AND car"},
            {label: "Google", apiQuery: "google AND android"},
            {label: "Microsoft", apiQuery: "microsoft AND windows"}
            ] },
            { name: 'Business', user: req.session.user.username, entries: [
            {label: "Wall Street", apiQuery: "Wall Street AND finance"},
            {label: "Stocks", apiQuery: "stock market AND trading"},
            {label: "Bitcoin", apiQuery: "Bitcoin AND cryptocurrency"},
            {label: "Economy", apiQuery: "global economy AND stock market"}
            ] },
            { name: 'World', user: req.session.user.username, entries: [
            {label: "Politics", apiQuery: "politics AND government"},
            {label: "Conflicts", apiQuery: "conflicts AND war"},
            {label: "Protests", apiQuery: "protests AND demonstrations"},
            {label: "Climate Change", apiQuery: "climate change AND environment"}
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