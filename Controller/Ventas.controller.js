const { MongoClient } = require("mongodb");
const express = require("express");
const routes = express.Router();

const functionModel = require('../Model/Functions.model');

// const uri = process.env.MONGO_URI;

routes.get("/:idTienda/:idUsuario/:idProducto/:cantidad/:pago", (req, res) => {
  const idTienda = req.params.idTienda * 1.0;
  const idUsuario = req.params.idUsuario * 1.0;
  var cantidad = req.params.cantidad * 1.0;
  const idProducto = req.params.idProducto * 1.0;
  const pago = req.params.pago * 1.0;

  async function transaccion() {
    const client = new MongoClient(uri);

    try {
      // Connect to the MongoDB cluster
      await client.connect();

      // El 'idUsuario' compra el 'idProducto' en 'cantidad' por el monto de 'pago'.
      await functionModel.comprar(client, idTienda, idUsuario, idProducto, cantidad, pago);
      res.send("Execution Correct");
    } catch (e) {
      res.send("Unexpected Error: " + e);
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  }

  transaccion().catch(console.error);
});


module.exports = routes;