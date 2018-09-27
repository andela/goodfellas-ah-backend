const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./models/index");

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send({ message: "Welcome to Author's Haven" }));

//test  database connection

app.get("/article", async (req, res) => {
  try {
    const article = await db.Article.findAll({});
    return res.status(200).json({
      status: "Success",
      data: article
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: "error"
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

module.exports = { app }
