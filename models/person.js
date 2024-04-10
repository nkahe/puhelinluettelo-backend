const mongoose = require('mongoose');

// dotenv:n avulla voidaan asettaa .env:ssä.
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(res => {
    console.log('connected to MongoDB');
  }).catch(err => {
    if (err) {
      console.log('error connecting to MongoDB:', error.message);
    } else {
      console.log('Failed to connect to database.');
    }
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: String
});

// MongoDB:n _id -> id ja turha __V pois.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);