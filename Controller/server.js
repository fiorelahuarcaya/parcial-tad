const express = require("express");
const cors = require("cors");

const routesProducto = require("./Producto.controller");
const routesVentasTienda = require("./Ventas.controller");

const app = express();
app.set("port", process.env.PORT || 9000);

// middlewares -------------------------------------
app.use(express.json());
app.use(cors());
// routes -------------------------------------------
app.get("/", (req, res) => {
  res.send("Api funcionando");
});

app.use("/api/producto", routesProducto);
app.use("/api/ventasT", routesVentasTienda);

// server running -----------------------------------
app.listen(app.get("port"), () => {
  console.log("server running on port", app.get("port"));
});
