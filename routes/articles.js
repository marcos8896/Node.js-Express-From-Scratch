const express = require('express');
const router = express.Router();


//Bring in article model.
let Article = require('../models/article');

//---------------------------GET REQUESTS-------------------------
router.get('/add', (req, res) =>{
  res.render('add_article', {
    title: 'Add article'
  });
});

//Get single article
router.get('/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
      title: 'Edit Article',
      article
    });
  })
});

//---------------------------POST REQUESTS-------------------------
//Catch Submit POST Route in order to add an new article
router.post('/add', (req, res) =>{
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
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
    article.author = req.body.author;
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
router.post('/edit/:id', (req, res) =>{
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
router.delete('/:id', (req, res) => {
  let query = {_id:req.params.id};

  Article.remove(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  })
});


//Get single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article
    });
  })
});

module.exports = router;
