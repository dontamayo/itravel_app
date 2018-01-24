const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.static('public'));

/**** SETUP DB CONNECTION ****/
const knex = require('./db.js');

/*
  GET ALL BIRDS
*/
app.get('/birds', (req, res) => {
  knex('birds').then((rows) =>  res.json(rows));
});

/*
  CREATE A BIRD
*/
app.post('/birds', (req, res) => {
  const { title, description } = req.body;

  const newBird = {
    title,
    description
  };

  knex('birds')
    .insert(newBird) // INSERTS A NEW BIRD
    .returning('*')
    .then((rows) => {
      const bird = rows[0];

      res.json(bird);
    });
});

/*
  FETCH A BIRD
*/
app.get('/birds/:bird_id', (req, res) => {
  const birdId = req.params.bird_id;

  knex('birds')
  .where('id', birdId) // look for bird_id
  .then((rows) => {
    const foundBird = rows[0];

    res.json(foundBird);
  })
  .catch(() => {
    res.sendStatus(404);
  });
});

/*
  PATCH A BIRD
*/
app.patch('/birds/:bird_id', (req, res) => {
  const birdId = req.params.bird_id;
  const { title, description } = req.body;

  knex('birds')
    .where('id', birdId)
    .returning('*')
    .update({ title, description })
    .then((rows) => {
      const bird = rows[0];

      res.json(bird);
    })
    .catch(() => {
      res.sendStatus(400);
    })
});

/*
  DELETE A BIRD
*/
app.delete('/birds/:bird_id', (req, res) => {
  knex('birds')
    .where('id', req.params.bird_id)
    .del()
    .then(() => res.sendStatus(204));
});

app.listen(PORT, () => console.log('Listening on', PORT))
