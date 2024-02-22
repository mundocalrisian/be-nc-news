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
    describe('ALL /* Invalid Endpoints', () => {
        test('should return a 404 status and message when a invalid path is passed', () => {
            return request(app)
            .get('/not_a_valid_endpoint')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Path not found')
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
    describe('GET /api/articles', () => {
        test('should respond with a 200 status and an array of article objects with the appropriate keys', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('articles')
                const articlesArray = response.body.articles
                expect(articlesArray.length).toBe(13)
                articlesArray.forEach((article) => {
                    const expectedArticle = {
                        'author': expect.any(String),
                        'title': expect.any(String),
                        'article_id': expect.any(Number),
                        'topic': expect.any(String),
                        'created_at': expect.any(String),
                        'votes': expect.any(Number),
                        'article_img_url': expect.any(String),
                        'comment_count': expect.any(Number)
                    }
                    expect(article).toMatchObject(expectedArticle)
                    expect(article).not.toHaveProperty('body')
                })
            })
        });
        test('articles in the array should be sorted by date created in descending order ', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
        });
    });
    });
    describe('GET /api/articles/:article_id', () => {
        test('should repsond with a status 200 and an object with the appropriate keys', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then((response) => {
                expect(response.body.article).toHaveProperty('author', expect.any(String))
                expect(response.body.article).toHaveProperty('title', expect.any(String))
                expect(response.body.article).toHaveProperty('article_id', 3)
                expect(response.body.article).toHaveProperty('body', expect.any(String))
                expect(response.body.article).toHaveProperty('topic', expect.any(String))
                expect(response.body.article).toHaveProperty('created_at', expect.any(String))
                expect(response.body.article).toHaveProperty('votes', expect.any(Number))
                expect(response.body.article).toHaveProperty('article_img_url', expect.any(String))
        })
    });
        test('should repsond with a 404 status when a valid but non-existent id is requested', () => {
            return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article does not exist')
            })
        });
        test('should repsond with a 400 status when an invalid endpoint is requested', () => {
            return request(app)
            .get('/api/articles/not_an_article')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('should repsond with a status 200 and an array of comments with the appropriate keys', () => {
            return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('comments')
                const commentsArray = response.body.comments
                expect(commentsArray).toHaveLength(2)
                commentsArray.forEach((comment) => {
                    const expectedComment = {
                        'comment_id': expect.any(Number),
                        'votes': expect.any(Number),
                        'created_at': expect.any(String),
                        'author': expect.any(String),
                        'body': expect.any(String),
                        'article_id': expect.any(Number)
                    }
                expect(comment).toMatchObject(expectedComment)
                })
            })
        })
        test('the array of comments should be sorted by date created in descending order', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .then((response) => {
                expect(response.body.comments).toBeSortedBy('created_at', {descending: true})
            })
        })
        test('should respond with a 404 status when a valid but non-existent id is supplied', () => {
           return request(app)
            .get('/api/articles/99999/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article does not exist')
            })
        });
        test('should respond with a 400 status when an invalid endpoint is supplied ', () => {
            return request(app)
            .get('/api/articles/not_a_number/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        test('should return a 200 status, message and an empty array when a valid article id is passed but has no comments assosciated', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((response) => {
                expect(response.body.msg).toBe('No comments associated')
                expect(response.body.comments).toEqual([])
                expect(response.body.comments).toHaveLength(0)
            })
        });
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test('should insert a new comment and return a 201 status, along with an object of the new comment', () => {
            const newComment = {
                author: 'icellusedkars',
                body: 'We will see about that!'
            }
            return request(app)
            .post('/api/articles/13/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                const expectedResponse = {
                    body: 'We will see about that!',
                    article_id: 13,
                    author: 'icellusedkars',
                }
                expect(response.body.postedComment).toMatchObject(expectedResponse)

            })
        });
        test('should add comment_id, votes and created_at fields to the repsonse', () => {
            const newComment ={
                author: 'icellusedkars',
                body: 'We will see about that!'
            }
            return request(app)
            .post('/api/articles/13/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                const expectedResponse = {
                    comment_id: expect.any(Number),
                    body: 'We will see about that!',
                    article_id: 13,
                    author: 'icellusedkars',
                    votes: 0,
                    created_at: expect.any(String)
                }
                expect(response.body.postedComment).toMatchObject(expectedResponse)
            })
        });
        test('should respond with a 404 status and message when an article_id that is valid but does not exist is supplied', () => {
            const newComment = {
                author: 'icellusedkars',
                body: 'We will see about that!'
            }
            return request(app)
            .post('/api/articles/9999/comments')
            .send(newComment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('does not exist')
            })
        });
        test('should respond with a 400 status and message when an invalid article is requested', () => {
            const newComment = {
                author: 'icellusedkars',
                body: 'We will see about that!'
            }
            return request(app)
            .post('/api/articles/not_an_article/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        test('should respond with a 404 status and message when an invalid user is supplied ', () => {
            const newComment = {
                author: 'not_a_valid_user',
                body: 'We will see about that!'
            }
            return request(app)
            .post('/api/articles/13/comments')
            .send(newComment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('does not exist')
            })
        });
        test('should respond with a 400 status and message when a required field is not supplied', () => {
            const newComment = {
                author: 'icellusedkars'
            }
            return request(app)
            .post('/api/articles/13/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        test('should respond with a 400 status and message if an object with additional keys is supplied', () => {
            const newComment = {
                author: 'icellusedkars',
                body: 'We will see about that!',
                not_valid: "not valid"
            }
            return request(app)
            .post('/api/articles/13/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
    });
    describe('PATCH /api/articles/:article_id', () => {
        test('should respond with a 200 status along with an object of the updated article', () => {
            const votesToPatch = {
                inc_votes: 5
            }
            return request(app)
            .patch('/api/articles/3')
            .send(votesToPatch)
            .expect(200)
            .then((response) => {
                const expectedResponse = {
                    article_id : 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: "2020-11-03T09:12:00.000Z",
                    votes: 5,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700" 
                }
                expect(response.body.updated_article).toMatchObject(expectedResponse)
            })
        });
        test('should respond with a 404 status and message when an article_id that is valid but does not exist is supplied', () => {
            const votesToPatch = {
                inc_votes: 5
            }
            return request(app)
            .patch('/api/articles/9999')
            .send(votesToPatch)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article does not exist')
            })
        });
        test('should respond with a 400 status and message when an invalid article is requested', () => {
            const votesToPatch = {
                inc_votes: 5
            }
            return request(app)
            .patch('/api/articles/not_an_article')
            .send(votesToPatch)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        test('should respond with a 400 status and message when a value for inc_votes that is not a number is supplied', () => {
            const votesToPatch = {
                inc_votes: 5,
                not_valid: "not valid"
            }
            return request(app)
            .patch('/api/articles/3')
            .send(votesToPatch)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        test('should respond with a 400 status and message if an object with additional keys is supplied', () => {
            const votesToPatch = {
                inc_votes: 'not_a_number'
            }
            return request(app)
            .patch('/api/articles/3')
            .send(votesToPatch)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
    });
})