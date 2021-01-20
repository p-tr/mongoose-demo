const express = require('express');
const mongoose = require('mongoose');
const bp = require('body-parser');

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

app = express();

app.use(bp.json());

// liste des routes CRUD
//    - lister / rechercher les bikes           GET /bikes
//    - afficher 1 bike (par ID)                GET /bikes/:id
//    - créer                                   POST /bikes
//    - mettre à jour                           PUT /bikes/:id
//    - supprimer                               DELETE /bikes/:id

app.get('/bikes', async (req, res) => {
  const bikes = await Bike.find();
  res.json(bikes);
});

app.get('/bikes/:id', async (req, res) => {
  const { id } = req.params;
  let bike;

  try {
    bike = await Bike.findOne({ _id: id });
  } catch(err) {
    res.status(400).json(err);
  }

  if(bike) {
    res.json(bike);
  } else {
    res.status(404).json({
      message: "Bike not found !"
    });
  }
});

app.post('/bikes', async (req, res) => {
  const { brand, model } = req.body;
  const bike = new Bike({ brand, model });

  try {
    await bike.save();
  } catch(err) {
    res.status(400).json(err);
  }

  res.status(201).json(bike);
});

app.put('/bikes/:id', async (req, res) => {
  const { id } = req.params;
  const { brand, model } = req.body;

  let bike;

  try {
    bike = await Bike.findOne({ _id: id });
  } catch(err) {
    res.status(400).json(err);
  }

  if(bike) {
    bike.brand = brand;
    bike.model = model;

    try {
      await bike.save();
    } catch(err) {
      res.status(400).json(err);
    }

    res.status(200).json(bike);
  } else {
    res.status(404).json({
      message: "Bike not found !"
    });
  }
});

app.delete('/bikes/:id', async (req, res) => {
  const { id } = req.params;

  let bike;

  try {
    bike = await Bike.findOne({ _id: id });
  } catch(err) {
    res.status(400).json(err);
  }

  if(bike) {
    try {
      await bike.remove();
    } catch(err) {
      res.status(500).json(err);
    }

    res.status(204).end();
  } else {
    res.status(404).json({
      message: "Bike not found !"
    });
  }
})

app.listen(4000, () => {
  console.log('Server is ready on :4000 !');
});
