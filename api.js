const express = require('express');
const bp = require('body-parser');

const { Bike } = require('./db');

const api = express();

api.use(bp.json());

// liste des routes CRUD
//    - lister / rechercher les bikes           GET /bikes
//    - afficher 1 bike (par ID)                GET /bikes/:id
//    - créer                                   POST /bikes
//    - mettre à jour                           PUT /bikes/:id
//    - supprimer                               DELETE /bikes/:id

api.get('/bikes', async (req, res) => {
  const bikes = await Bike.find();
  res.json(bikes);
});

api.get('/bikes/:id', async (req, res) => {
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

api.post('/bikes', async (req, res) => {
  const { brand, model } = req.body;
  const bike = new Bike({ brand, model });

  try {
    await bike.save();
  } catch(err) {
    res.status(400).json(err);
  }

  res.status(201).json(bike);
});

api.put('/bikes/:id', async (req, res) => {
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

api.delete('/bikes/:id', async (req, res) => {
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
});

module.exports = { api };
