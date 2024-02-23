# Northcoders News API

### Welcome to NC News! ###

NC News is an API written in JavaScript that uses PostgreSQL databases to interacts with articles, comments, topics and users from various endpoints.

A hosted version of this API can be found at https://nc-news-b3bj.onrender.com/api

## Install

To start using this project, please first clone the repository from GitHub using the following command

    git clone https://github.com/mundocalrisian/nc-news.git

Next you'll need to install the dependencies using 

    npm install

In order to seed the databases, you will need to create two files`.env.test` and `.env.development` and then input the following values `PGDATABASE=nc_news_test` and `PGDATABASE=nc_news` respectively (both of these values are also listed in the `/db/setup.sql` file).

Both these .env files should then be added to the .gitignore file.

Now to seed the databases, run the following

    npm run setup-dbs

and to then seed each database

    npm run seed

    npm run test

## API endpoints
**`GET /api`**
- serves up a json representation of all the available endpoints of the api

**`GET /api/topics`**
- serves an array of all topics

**`GET /api/users`**
- serves an array of all users

**`GET /api/users/:username`**
- serves an object of the user with requested username

**`GET /api/articles`**
- serves an array of all articles

**`GET /api/articles/:article_id`**
- serves an object of the article with requested id

**`GET /api/articles/:article_id/comments`**
- serves an array of all comments assosciated with a requested id

**`POST /api/articles/:article_id/comments`**
- posts a new comment and serves an object of the comment

**`PATCH /api/articles/:article_id`**
- increases the votes assosciated with the requsted id and serves an object of the updated article

**`DELETE /api/comments/:comment_id/`**
- deletes the comment with requested id

## Technologies Used

-   NodeJS - https://nodejs.org/en (minimum version 20.10.0)
-   PostgreSQL - https://www.postgresql.org/ (minimum version 16.2)
-   Express - https://expressjs.com/
-   npm - https://www.npmjs.com/
-   jest - https://jestjs.io/
-   pg - https://www.npmjs.com/package/pg
-   supertest - https://www.npmjs.com/package/supertest
-   dotenv - https://www.npmjs.com/package/dotenv
-   pg-format - https://www.npmjs.com/package/pg-format
-   husky - https://typicode.github.io/husky/

## Authors
- **mundocalrisian** - https://github.com/mundocalrisian/
- **northcoders** - https://github.com/northcoders

