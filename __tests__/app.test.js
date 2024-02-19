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
    describe('GET /api', () => {
        test('should return an object with all available endpoints and a description, query and example', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const endpointsObj = response.body.endpoints
                expect(endpointsObj).toHaveProperty('GET /api', expect.any(Object))
                expect(endpointsObj).toHaveProperty('GET /api/topics', expect.any(Object))
                expect(endpointsObj).toHaveProperty('GET /api/articles', expect.any(Object))
                for (const endpoint in endpointsObj) {
                    expect(endpointsObj[endpoint]).toHaveProperty('description', expect.any(String))
                    expect(endpointsObj[endpoint]).toHaveProperty('queries', expect.any(Array))
                    expect(endpointsObj[endpoint]).toHaveProperty('exampleResponse', expect.any(Object))
                }
            })
        });
    });
});