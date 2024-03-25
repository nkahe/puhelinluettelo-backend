// Komentorivityökalu tietokannan käsittelyyn.

const mongoose = require('mongoose');

console.log('Argumenttien määrä: ', process.argv.length);

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://heka:${password}@cluster.rvzhvul.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=Cluster`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

function addNewPerson() {
  const newName = process.argv[3];

  if (process.argv.length === 4) {
    console.log("give person's number as argument");
    process.exit(1);
  }

  const newNumber = process.argv[4];

  const newPerson = new Person({
    name: newName,
    number: newNumber,
  })

  newPerson.save().then(result => {
    console.log(`added ${newName} ${newNumber} to phonebook`);
    mongoose.connection.close();
  }).catch(err => {
    console.log('got error', error);
  })
}

function listAll() {
  console.log('Listataan..');

  Person.find({}).then(result => {

    result.forEach(person => {
      console.log(person);
    });

    mongoose.connection.close();
    process.exit();
  });
}

if (process.argv.length === 3) {
  listAll();
} else {
  addNewPerson();
}
