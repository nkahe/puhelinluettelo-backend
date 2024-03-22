const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// mahdollisuus käyttää eri originia.
app.use(cors());

app.use(express.json());

// loggaaminen.
app.use(morgan('tiny'));

// middleware staattisen sisällön näyttämiseen.
app.use(express.static('dist'));

const url =
  `mongodb+srv://heka:${password}@cluster.rvzhvul.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=Cluster`

mongoose.set('strictQuery', false);
mongoose.connect(url);

/*
let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-532232",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
];
*/

app.get('/api/persons', (req, res) => {
  res.json(persons);
});


app.get('/info', (req, res) => {
  const timeStamp = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${timeStamp}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }

});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
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

  const existAlready = persons.some(person => person.name === body.name);

  if (existAlready === true) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const ID = Math.floor(Math.random() * 1000);

  const newPerson = {
    name: body.name,
    number: body.number,
    id: ID
  }

  persons = persons.concat(newPerson);
  console.log('lisätään: ', newPerson);
  res.json(newPerson);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});