require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const uuid = require('uuid/v4');

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
app.use(express.json());

app.get('/bookmarks', (req, res) => {
  res.json(arrayOfBookmarks)
})

app.get('/bookmarks/:id', (req, res) => {
	const { id } = req.params
	for (let i = 0 ; i < arrayOfBookmarks.length; i++) {
		if (id === arrayOfBookmarks[i].id) {
			res.json(arrayOfBookmarks[i])
		}	
	}
		return res
			.status(404)
			.send("Not Found");
})

app.post('/bookmarks', (req, res) => {
  const { title, url, description } = req.body;

  if (!title) {
    return res
      .status(400)
      .send("Invalid data");
  }
  if(!url) {
    return res 
      .status(400)
      .send("Invalid data");
  }
  if(!description) {
    return res 
      .status(400)
      .send("Invalid data");
  }

  const id = uuid();

  const bookmark = {
    title,
    url,
    description,
    id: uuid()
  };

  store.bookmarks.push(bookmark)

  logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark)
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app