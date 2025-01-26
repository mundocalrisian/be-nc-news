const db = require('../db/connection');

afterAll(() => db.end)

describe('CONNECTION', () => {
    test('should connect and return ', () => {
        connectionTest = async () => {
            const results = await db.query('SELECT * FROM topics');
            return results.rows;
        }

        const expectedArray = [
            {"description": "The man, the Mitch, the legend", "slug": "mitch"}, 
            {"description": "Not dogs", "slug": "cats"}, 
            {"description": "what books are made of", "slug": "paper"}
        ]

        return connectionTest()
        .then((outcome) => {
            expect(outcome).toEqual(expectedArray)
        })
    });
});
