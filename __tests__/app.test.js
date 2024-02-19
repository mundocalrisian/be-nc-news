const app = require('../app.js')
const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const db = require('../db/connection.js')

beforeEach(() => seed(data))
afterAll(() => db.end)

describe('APP', () => {
    describe('GET /api/healthcheck', () => {
        test('should respond with a 200 status and a message confirming functionality', () => {
            return request(app)
            .get('/api/healthcheck')
            .expect(200)
            .then((repsonse) => {
                expect(repsonse.body).toHaveProperty('msg', 'Healthcheck ok')
            })
        });
    });
    describe('GET /api/topics', () => {
        test('should repsond with a 200 status', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('topics')
                const topicsArray = response.body.topics
                expect(topicsArray).toHaveLength(3)
                topicsArray.forEach((topic) => {
                    expect(topic).toHaveProperty('description', expect.any(String))
                    expect(topic).toHaveProperty('slug', expect.any(String))
                })
            })
        });
        
    });
});