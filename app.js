const express = require('express');
const path = require('path');

//Init App
const app = express();

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) =>{

  let articles = [
    {
      id: 1,
      title: 'Article One',
      author: 'Brad Jonhson'
      body: 'Body of article one'
    },

    {
      id: 2,
      title: 'Article Two',
      author: 'John Doe'
      body: 'Body of article two'
    }


  ]

  res.render('index', {
    title: 'Hello'
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
