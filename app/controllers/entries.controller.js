const Category = require('../models/category')
const { check, validationResult } = require('express-validator')

module.exports = {
    deleteEntry: deleteEntry,
    processEditEntry: processEditEntry,
    showCreateEntry: showCreateEntry,
    processCreateEntry: processCreateEntry,
    showEditEntry: showEditEntry
}

async function showCreateEntry(req, res) {
    res.render('pages/createEntry', {
        categorySlug: req.params.slug,
        errors: req.flash('errors')
    })
}

async function processCreateEntry(req, res) {
    await check('label', 'Label is required').notEmpty().run(req)
    await check('apiQuery', 'API query is required').notEmpty().run(req)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.errors.map(err => err.msg))
        return res.redirect('/categories/' + req.params.slug + '/showCreateEntry')
    }

    const entry = {
        label: req.body.label, 
        apiQuery: req.body.apiQuery
    }

    try {
        await Category.updateOne({ slug: req.params.slug }, { $push: { entries: entry } } )
        req.flash('success', 'Successfully created entry!')
        res.redirect('/categories/' + req.params.slug + '/view', )
    } catch {
        res.status(500)
        res.send('Entry not saved!')
    }
}

async function showEditEntry(req, res) {
    try {
        const category = await Category.findOne({ slug: req.params.slug }, 
            { entries: { $elemMatch: { _id: req.params._id } } })
        const entry = category.entries[0]

        res.render('pages/editEntry', {
            categorySlug: req.params.slug,
            entry: entry,
            success: req.flash('success'),
            errors: req.flash('errors')
        })
    } catch {
        res.status(404)
        res.send('Entry not found!')
    }
}

async function processEditEntry(req, res) {
    await check('label', 'Label is required').notEmpty().run(req)
    await check('apiQuery', 'API query is required').notEmpty().run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.errors.map(err => err.msg))
        return res.redirect('/categories/' + req.params.slug + '/showEditEntry')
    }

    try {
        await Category.updateOne({ slug: req.params.slug, "entries._id": req.params._id },  
            { $set: { "entries.$.label": req.body.label, "entries.$.apiQuery": req.body.apiQuery } })
        req.flash('success', 'Successfully modified entry!')
        res.redirect('/categories/' + req.params.slug + '/view', )
    } catch {
        res.status(500)
        res.send('Entry not saved!')
    }
}

async function deleteEntry(req, res) {
    try {
        await Category.updateOne(
            { user: req.session.user.username, slug: req.params.slug }, // Find the category
            { $pull: { entries: { _id: req.params._id } } } //Remove entry
        )
        
        req.flash('success', 'Entry Deleted.')
        res.redirect('/categories/' + req.params.slug + '/view')
    } catch {
        res.status(500)
        res.send('entry not deleted!')
    }
}
