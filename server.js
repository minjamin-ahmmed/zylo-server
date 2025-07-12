const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5174", "https://zyloo-client.vercel.app/api"],
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

app.get("/products", async (req, res) => {
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

app.get("/", (req, res) => {
  res.send("Zyloooooo Server is running");
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Zyloooooo Server is running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;
