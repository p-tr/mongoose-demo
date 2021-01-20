const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const { Schema, model } = mongoose;

const BikesSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true }
});

const Bike = model('bikes', BikesSchema);

module.exports = { Bike };
