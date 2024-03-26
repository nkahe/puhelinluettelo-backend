// Ympäristömuuttujat .env:stä.
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

// mahdollisuus käyttää eri originia.
app.use(cors());

app.use(express.json());

// loggaaminen.
app.use(morgan('tiny'));

/* tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö
  pyynnön polkua vastaavan nimistä tiedostoa hakemistosta dist. Jos löytyy, 
  palauttaa Express tiedoston. */
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
    console.log(persons);
  });
});

app.get('/info', (req, res) => {
  const timeStamp = new Date();
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${timeStamp}</p>
    `);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then( person => {
    res.json(person);
  }).catch(() => {
    res.status(404).end();
  });

});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personToDelete = persons.find(person => person.id === id);
  console.log('Poistettava: id: ', id, 'person: ', personToDelete);
  if (personToDelete) {
    persons = persons.filter(person => person.id !== id);
    res.status(200).json(personToDelete);
  } else {
    console.log('Ei löytynyt poistettavaa.');
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  console.log('body: ', body);

  console.log('name: ', body.name);

  if (body.hasOwnProperty('name') === false) {
    return res.status(400).json({
      error: 'person name missing'
    });
  }

  if (body.hasOwnProperty('number') === false) {
    return res.status(400).json({
      error: 'person number missing'
    });
  }

  /*
  const existAlready = persons.some(person => person.name === body.name);

  if (existAlready === true) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }
  */

  // const ID = Math.floor(Math.random() * 1000);

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  console.log('lisätään: ', newPerson);

  newPerson.save().then(savedPerson => {
    res.json(savedPerson);
  });

});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});