const User = require('../models/user')
const Category = require('../models/category')
const Search = require('../models/search')
const { seedCategories } = require('../middleware')

module.exports = {
    showHomePage: showHomePage,
    showSignUp: showSignUp,
    showLogin: showLogin,
    login: login,
    signUp: signUp,
    logOut: logOut,
    search: search,
    deleteAccount: deleteAccount,
    clearSearches: clearSearches
}

async function showHomePage(req, res) {
    try {
        let categories = await Category.find({ user: req.session.user.username })

        //If there are no categories, the defaults are seeded
        if(!categories || categories.length === 0) {
            await seedCategories(req, res, 'ignore')
            categories = await Category.find({ user: req.session.user.username })
        }

        const searchHistory = await Search.find({ user: req.session.user.username })
    
        //If there is no search in progress, send default blank query.
        searchQuery = req.body.search
        if(searchQuery === undefined) {
            searchQuery = ""
        }

        res.render('pages/newsDisplay', {
            categories: categories,
            searchHistory: searchHistory,
            query: searchQuery
        })
    } catch {
        res.status(404)
        res.send('Data not found!')
    }
}

async function search(req, res) {
    try {
        const existingSearch = await Search.findOne({ user: req.session.user.username, query: req.body.search })

        //If the search is already in the history, it is not added.
        if(existingSearch === undefined || !existingSearch) {
            const newSearch = new Search({ user: req.session.user.username, query: req.body.search })
            await newSearch.save()
        }
    } catch (error) {
        console.error('Error saving search entry:', error)
    }
    showHomePage(req, res)
}

async function logOut(req, res) {
    req.session.user = undefined
    res.redirect('/frontpage.html')
}

async function login(req, res) {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username: username })
        
        //Checking that the username exists in DB
        if (user === null || user === undefined) {
            return res.redirect('/showLogin')
        }
        
        if (password !== user.password) {
            return res.redirect('/showLogin')
        }

        req.session.user = { id: user.id, username: user.username }
        res.redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error.')
    }
}

async function signUp(req, res) {
    try {
        const existingUser = await User.findOne({ username: req.body.username })
        if (existingUser) {
            return res.redirect('/showSignUp')
        }

        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        })

        // Save the user to the database
        await newUser.save()
        res.redirect('/showLogin')
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create user' })
    }
}

async function deleteAccount(req, res) {
    try {
        //Delete all saved data related to the user
        await Search.deleteMany({ user: req.session.user.username })
        await Category.deleteMany({ user: req.session.user.username })
        await User.deleteOne({ username: req.session.user.username })
    } catch {
        console.error('Error removing user:', error)
    }
    logOut(req, res)
}

function showLogin(req, res) {
    res.render('pages/login', {
        errors: req.flash('errors')
    })
}

function showSignUp(req, res) {
    res.render('pages/signup', {
        errors: req.flash('errors')
    })
}

async function clearSearches(req, res) {
    try {
        await Search.deleteMany({ user: req.session.user.username })
    } catch (error) {
        console.error('Error removing searches:', error)
    }
    showHomePage(req, res)
}