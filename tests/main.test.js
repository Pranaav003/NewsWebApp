const request = require('supertest')
const app = require('../app/controllers/main.controller')

describe('POST /login', function () {
    it('valid input', function (done) {
        request(app)
            .post('/login')
            .send({
                username: 'Example',
                password: 'password'
            })
            .expect(200, {}, done)
    })

    it('invalid input', function (done) {
        request(app)
            .post('/login')
            .send({
                username: 'Example Incorrect',
                password: 'pass'
            })
            .expect(400, {}, done)
    })
})


