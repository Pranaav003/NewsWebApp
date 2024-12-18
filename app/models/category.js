const mongoose = require('mongoose'),
    Schema = mongoose.Schema

// create a schema
const categorySchema = new Schema({
    name: String,
    user: String,
    slug: {
        type: String,
        unique: true
    },
    entries: [{
        label: String,
        apiQuery: String
    }]
})

// middleware section
// make sure that the slug is created from the name
categorySchema.pre('save', function(next) {
    this.slug = slugify(`${this.user}-${this.name}`);
    next()
})

categorySchema.index({ slug: 1, user: 1 }, { unique: true });

// create the model
const categoryModel = mongoose.model('category', categorySchema)

// export the model
module.exports = categoryModel

// function to slugify a name
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
}

