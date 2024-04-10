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
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  }).catch(() => {
    res.status(404).end();
  });

});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  //const personToDelete = persons.find(person => person.id === id);

  Person.findByIdAndDelete(id)
    .then(result => {

      console.log('app.delete: vastaus: ', result);

      res.json(result);
    })
    .catch(error => next(error));

    /*
  console.log('Poistettava: id: ', id, 'person: ', personToDelete);
  if (personToDelete) {
    persons = persons.filter(person => person.id !== id);
    res.status(200).json(personToDelete);
  } else {
    console.log('Ei löytynyt poistettavaa.');
    res.status(404).end();
  }
  */
});

app.put('/api/persons/:id', (req, res, next) => {

  const body = req.body;

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

  const person = {
    name: body.name,
    number: body.number
  }

  // new: true aiheuttaa, että palauttaa uuden tiedon eikä vanhaa.
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
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

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  Person.findOne({ name: newPerson.name })
    .then(person => {
      console.log('person: ', person);
      if (person) {
        return res.status(400).json({
          error: 'name must be unique'
        });
      } else {
        // Menee catchiin jos validointi epäonnistuu.
        newPerson.save().then(savedPerson => {
          res.json(savedPerson);
        }).catch(err );
      }
    }).catch(error => next(error))
});

const errorHandler = (error, req, res, next) => {
  if (error.message) {
    console.error(error.message);
  }
  if (res.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  // virheenkäsittely Expressin oletusarvoisen virheidenkäsittelijän hoidettavaksi.
  next(error);
}

/*  virheidenkäsittelijämiddleware tulee rekisteröidä muiden middlewarejen sekä
routejen rekisteröinnin jälkeen. */
app.use(errorHandler);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

// Pitää olla routeista ja middlewareista viimeisimpänä.

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});