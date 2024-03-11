const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

app.use(morgan('tiny'));



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
  const person = persons.find(person => person.id === id);

  if (person) {
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const generateID = () => {
  const id = Math.floor(Math.random() * 1000);
  return id;
}

app.post('/api/persons', (req, res) => {
  const body = req.body;

  console.log('body', body);

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

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateID
  }

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});