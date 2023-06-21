const express = require("express");
const app = express();
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const itemsPool = require("./DBConfig");

app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

app.get("/api/items", async (req, res) => {
  try {
    const { rows: allItems} = await itemsPool.query("SELECT * FROM items");
    console.log(allItems);
    res.json({ allItems });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.post("/api/items", async (req, res) => {
  const { description } = req.body;
  try {
    const newItem = await itemsPool.query(
      "INSERT INTO items (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json({
      message: "New item added!",
      item: newItem.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.listen(3333, () => {
  console.log("Server running on port 3333");
});
