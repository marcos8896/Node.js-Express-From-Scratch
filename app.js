const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection.
db.once('open', () => {
  console.log("Connected to MongoDB");
});

//Check for errors.
db.on('error', (err) => {
  console.log(err);
});

//Init App
const app = express();

//Bring in models.
let Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else{
      res.render('index', {
        title: 'Hello',
        articles: articles
      });
    }
  });
});

app.get('/articles/add', (req, res) =>{
  res.render('add_article', {
    title: 'Add article'
  });
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
