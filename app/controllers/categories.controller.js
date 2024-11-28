const Category = require('../models/category')
const { check, validationResult } = require('express-validator')

module.exports = {
    deleteAll: deleteAll,
    showCategories: showCategories,
    seedCategories: seedCategories,
    showCreate: showCreate,
    processCreateCategory: processCreateCategory,
    deleteCategory: deleteCategory,
    viewCategory: viewCategory,
    processEditCategory: processEditCategory,
    showEditCategory: showEditCategory
}

async function deleteAll(req, res) {
    try {
        await Category.deleteMany({})
        req.flash('success', 'Deletion complete')
        res.redirect('/categories')
    } catch {
        res.status(500)
        res.send('Deletion Failed')
    }
}

async function showEditCategory(req, res) {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
        res.render('pages/editCategory', {
            category: category,
            success: req.flash('success'),
            errors: req.flash('errors')
        })
    } catch {
        res.status(404)
        res.send('Category not found!')
    }
}

async function processEditCategory(req, res) {
    await check('name', 'Name is required').notEmpty().run(req)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.errors.map(err => err.msg))
        return res.redirect('/categories/' + req.params.slug + '/showEditCategory')
    }

    try {
        let category = await Category.findOne({ slug: req.params.slug })
        category.name = req.body.name
        await category.save()
        req.flash('success', 'Changes saved!')
        res.redirect('/categories')
    } catch {
        res.status(500)
        res.send('Category not saved!')
    }
}

async function seedCategories(req, res) {
    const categories = [
        { name: 'Tech', entries: [
            {label: "Apple", apiQuery: "apple iphone ipad mac"},
            {label: "Tesla", apiQuery: "tesla car"}
        ] },
        { name: 'Business', entries: [
            {label: "Wall Street", apiQuery: "Wall Street AND finance"},
            {label: "Stocks", apiQuery: "stock market AND trading"},
            {label: "Bitcoin", apiQuery: "Bitcoin AND cryptocurrency"}
        ] },
        { name: 'World', entries: [
            {label: "Politics", apiQuery: "politics"},
            {label: "Conflicts", apiQuery: "conflicts"},
            {label: "Protests", apiQuery: "protests"},
            {label: "suprise Me!", apiQuery: "conflict OR war OR dispute"}
        ] }
    ]

    try {
        await Category.deleteMany({})
        for (category of categories) {
            let newCategory = new Category(category)
            await newCategory.save()
        }

        //Doesn't redirect if the request came from the home page loading
        if(res !== 'ignore') {
            req.flash('success', 'Categories seeded!')
            res.redirect('/categories')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Error seeding categories.');
    }
}

async function showCategories(req, res) {
    // get all categories
    try {
        categories = await Category.find({})

        // return a view with data
        res.render('pages/categories', {
            categories: categories,
            success: req.flash('success')
        })
    } catch {
        res.status(404)
        res.send('Categories not found!')
    }
}

function showCreate(req, res) {
    res.render('pages/createCategory', {
        errors: req.flash('errors')
    })
}

async function processCreateCategory(req, res) {
    // validate information
    await check('name', 'Name is required').notEmpty().run(req)

    // if there are errors, redirect and save errors to flash
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.errors.map(err => err.msg))
        return res.redirect('/categories/showCreate')
    }

    // create a new category
    const category = new Category({
        name: req.body.name,
        entries: []
    })

    // save
    try {
        await category.save()
        req.flash('success', 'Successfuly created category!')
        res.redirect('/categories')
    } catch {
        res.status(500)
        res.send('Category not saved!')
    }
}

async function viewCategory(req, res) {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
        res.render('pages/entries', {
            category: category,
            success: req.flash('success'),
        })
    } catch {
        res.status(404)
        res.send('Category not found!')
    }
}

     
async function deleteCategory(req, res) {
    try {
        await Category.deleteOne({ slug: req.params.slug })

        req.flash('success', 'Category deleted')
        res.redirect('/categories')
    } catch {
        res.status(500)
        res.send('Category not deleted!')
    }
}
