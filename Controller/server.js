const express = require("express");
const cors = require("cors");

const routesProducto = require("./Alfredo.controller");
const routesVentasTienda = require("./Reportes.controller");

const app = express();
app.set("port", process.env.PORT || 9000);

// middlewares -------------------------------------
app.use(express.json());
app.use(cors());
// routes -------------------------------------------
app.get("/", (req, res) => {
  res.send("Api funcionando");
});

app.use("/api/alfredo", routesProducto);
app.use("/api/reportes", routesVentasTienda);

// server running -----------------------------------
app.listen(app.get("port"), () => {
  console.log("server running on port", app.get("port"));
});
