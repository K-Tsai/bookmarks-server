require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const uuid = require('uuid/v4');
const bodyParser = express.json();
const bookmarksRouter = express.Router()
const app = express()
const arrayOfBookmarks= 
  [
		{
      title: "Google",
      url: "www.google.com",
      description: "this is a search engine",
      id: "ef2c7412-2e2a-4089-86ea-35d11e6b6e87"
    },
    {
			title: "Amazon",
			url: "www.amazon.com",
			description: "this is a ecommerce store",
			id: "63e6f383-7b17-46e2-b2d1-73c1bea09ac4"
		}
	]

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())


bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(arrayOfBookmarks)
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const { title, url, description, rating } = req.body

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }

    const bookmark = { id: uuid(), title, url, description, rating }

    store.bookmarks.push(bookmark)

    logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark)
  })
bookmarksRouter
  .route('/bookmarks/:bookmark_id') 
  .get((req, res) => {
	const { bookmark_id } = req.params
	for (let i = 0 ; i < arrayOfBookmarks.length; i++) {
		if (bookmark_id === arrayOfBookmarks[i].bookmark_id) {
			res.json(arrayOfBookmarks[i])
		}	
	}
		return res
			.status(404)
			.send("Not Found");
})

.delete((req, res) => {
  const { bookmark_id } = req.params

  const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${bookmark_id} not found.`)
    return res
      .status(404)
      .send('Bookmark Not Found')
  }

  store.bookmarks.splice(bookmarkIndex, 1)

  logger.info(`Bookmark with id ${bookmark_id} deleted.`)
  res
    .status(204)
    .end()
})

module.exports = app