const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("cycleDB");
    const ordersCollection = database.collection("orders");

    // Find collection with email
    // app.get("/appointments", async (req, res) => {
    //   const email = req.query.email;
    //   const date = new Date(req.query.date).toLocaleDateString();
    //   const query = { email: email, date: date };
    //   const cursor = appointmentsCollection.find(query);
    //   const appointments = await cursor.toArray();
    //   res.json(appointments);
    // });

    // Post new order
    app.post("/orders", async (req, res) => {
      const appointment = req.body;
      const result = await ordersCollection.insertOne(appointment);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Cycle Pro!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
