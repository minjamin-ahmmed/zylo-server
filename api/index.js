const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://zyloo-client.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zf7pxbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    console.log("Connected to MongoDB!");
  }
  return client;
}

app.get("/api/products", async (req, res) => {
  try {
    const client = await connectToDatabase();
    const database = client.db("Products");
    const productsCollection = database.collection("products");
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api", (req, res) => {
  res.send("Zyloooooo Server is running");
});

// Export for Vercel
module.exports = app;
