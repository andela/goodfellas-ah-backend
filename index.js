const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db =require('./models/index');

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send({ message: "Welcome to Author's Haven" }));

//test  database connection

app.get("/article",async (req,res)=>{
    try {
        const article = await db.Article.findAll({})
        return res.status(400).json({
            status:"Success",
            data:article
        })
    } catch (error) {
        return res.json({
            status:"error",
        })
    }

})


const port = process.env.PORT || 3200;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
