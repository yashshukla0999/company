const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');

const app = express();
const cors = require('cors');

const sequelize = new Sequelize('company', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

const Favorite = sequelize.define('Favorite', {
  title: DataTypes.STRING,
  year: DataTypes.INTEGER,
  type: DataTypes.STRING,
  poster: DataTypes.STRING
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', (req, res) => {
  const searchQuery = req.body.searchQuery;

  axios.get(`http://www.omdbapi.com/?s=${searchQuery}&apikey=300a7804`)
    .then(response => {
      const movies = response.data.Search || [];
      res.send(movies);
    })
    .catch(error => {
      console.error('Error fetching data from OMDB:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/favorites', async (req, res) => {
  try {
    const favorites = await Favorite.findAll();
    res.send(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/favorite', async (req, res) => {
  const { title, year, type, poster } = req.body;

  try {
    await Favorite.create({ title, year, type, poster });
    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
});
