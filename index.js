const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SETTING UP DATABASE
const uri = `mongodb+srv://final:t9xu6F9h46PS7wCr@cluster0.j6ced.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MAIN INITIALIZATION
async function run() {
  try {
    await client.connect();
    const database = client.db("Dbcycle");
    const ordersCollection = database.collection("orders");
    const productsCollection = database.collection("products");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

    // POST API IN PRODUCTS
    app.post("/products", async (req, res) => {
      const newPlan = req.body;
      const result = await productsCollection.insertOne(newPlan);
      res.json(result);
    });

    // app.get("/orders", async (req, res) => {
    //   const email = req.query.email;

    //   const query = { email: email };

    //   const cursor = ordersCollection.find(query);
    //   const orders = await cursor.toArray();
    //   res.json(orders);
    // });

    // POST REVIEW
    app.post("/reviews", async (req, res) => {
      const newPlan = req.body;
      const result = await reviewsCollection.insertOne(newPlan);
      res.json(result);
    });

    //  GET API FROM REVIEWS
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const products = await cursor.toArray();
      // console.log(products);
      res.json(products);
    });

    //  GET API WHICH WAS PLACED ORDERED BY USER
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      // console.log(products);
      res.json(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await productsCollection.findOne(query);
      res.json(order);
    });

    //  GET API WHICH WAS PLACED ORDER BY USER WITH THEIR EMAIL
    app.get("/products/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const order = await productsCollection.find(query);
      console.log(order);
      res.json(order);
    });

    //  GET API OF ORDERS
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const products = await cursor.toArray();
      console.log(products);
      res.json(products);
    });

    // POST API IN Orders
    app.post("/orders", async (req, res) => {
      const newPlan = req.body;
      const result = await ordersCollection.insertOne(newPlan);
      res.json(result);
    });

    // Get api in orders
    app.get("/orders", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };

      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // GET API
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const plans = await cursor.toArray();
      res.send(plans);
    });

    // UPDATE PLAN
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
          post: updatedUser.post,
          status: updatedUser.status,
        },
      };
      const result = await productsCollection.updateOne(filter, updateDoc);
      console.log("update user", id);
      res.json(result);
    });

    // DELETE Orders
    app.delete("/devplan/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // DELETE Product
    app.delete("/devproducts/:id", async (req, res) => {
      const result = await productsCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Add user to the database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      // console.log(result);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // Update user to the database (login with google mainly)
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to my site...");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
