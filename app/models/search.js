const mongoose = require('mongoose'),
    Schema = mongoose.Schema

// create a schema
const searchSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    query: {
        type: String,
        required: true
    },
})

searchSchema.pre('save', function(next) {
    this.slug = slugify(`${this.user}-${this.query}`);
    next()
})

searchSchema.index({ slug: 1, user: 1 }, { unique: true });

// create the model
const searchModel = mongoose.model('search', searchSchema)

// export the model
module.exports = searchModel

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
}

