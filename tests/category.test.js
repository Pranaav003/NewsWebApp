const request = require('supertest')
const app = require('../app/controllers/categories.controller')

describe('GET /showCategories', function () {
    it('Category Test', function (done) {
        request(app)
            .get('/showCategories')
            .expect(200, done)
    })
})