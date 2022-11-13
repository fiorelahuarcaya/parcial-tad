const { MongoClient } = require("mongodb");
const express = require("express");
const routes = express.Router();

const functionModel = require('../Model/Functions.model');
const uri = "mongodb+srv://admin123:5vOpf6yh@cluster0.662rtvn.mongodb.net/test";


routes.get("", (req, res) => {
  async function seleccion() {
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const resultado = await functionModel.findAlfredoLibre(client);
      res.send(resultado);
    } finally {
      await client.close();
    }
  }
  seleccion().catch(console.error);
});

module.exports = routes;
