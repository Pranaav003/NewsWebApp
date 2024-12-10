const request = require('supertest')
const app = require('../app')

//Should redirect into app and return 302 code
describe('POST /signUp', function () {
    it('valid input', function (done) {
        request(app)
            .post('/signUp')
            .send({
                username: 'Example',
                password: 'password'
            })
            .expect(302, {}, done)
    })
})

//If account exists, 302 for page found
//If the account credentials are wrong, should see 404 bad request
describe('POST /login', function () {
    it('valid input', function (done) {
        request(app)
            .post('/login')
            .send({
                username: 'Example',
                password: 'password'
            })
            .expect(302, {}, done)
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

