const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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


// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//---------------------------GET REQUESTS-------------------------
//Home route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else{
      res.render('index', {
        title: 'Index',
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

//Get single article
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article
    });
  })
});

//Get single article
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
      title: 'Edit Article',
      article
    });
  })
});

//---------------------------POST REQUESTS-------------------------
//Catch Submit POST Route in order to add an new article
app.post('/articles/add', (req, res) =>{
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err) => {
    if (err) {
        console.log(err);
        return;
    } else{
      res.redirect('/');
    }
  });

});

//Catch Submit POST Route in order to edit an article.
app.post('/articles/edit/:id', (req, res) =>{
  let article = {}
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, (err) => {
    if (err) {
        console.log(err);
        return;
    } else{
      res.redirect('/article/'+req.params.id);
    }
  });

});

//---------------------------DELETE REQUESTS-------------------------
//Delete an article
app.delete('/article/:id', (req, res) => {
  let query = {_id:req.params.id};

  Article.remove(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  })
});


app.listen(4000, () => {
  console.log('Server started on port 4000');
});
