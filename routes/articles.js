const express = require('express');
const router = express.Router();


//Bring in models.
let Article = require('../models/article');
let User = require('../models/user');

//---------------------------GET REQUESTS-------------------------
router.get('/add', ensureAuthenticated, (req, res) =>{
  res.render('add_article', {
    title: 'Add article'
  });
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (article.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      article
    });
  })
});

//---------------------------POST REQUESTS-------------------------
//Catch Submit POST Route in order to add an new article
router.post('/add', ensureAuthenticated, (req, res) =>{
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('add_article', {
      title: 'Add article',
      errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save((err) => {
      if (err) {
          console.log(err);
          return;
      } else{
        req.flash('success', 'Article added');
        res.redirect('/');
      }
    });
  }

});

//Catch Submit POST Route in order to edit an article.
router.post('/edit/:id', ensureAuthenticated, (req, res) =>{
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
      req.flash('info', 'Article updated');
      res.redirect('/articles/'+req.params.id);
    }
  });

});

//---------------------------DELETE REQUESTS-------------------------
//Delete an article
router.delete('/:id', ensureAuthenticated,  (req, res) => {

  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id};

  Article.findById(req.params.id, (err, article) => {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, (err) => {

        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});


//Get single article
router.get('/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {

    User.findById(article.author, (err, user) => {

      res.render('article', {
        article,
        author: user.name
      });

    });
  });
});

//Access Control
function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
      return next();
    } else{
      req.flash('danger', 'Please, login.');
      res.redirect('/users/login');
    }
}


module.exports = router;
