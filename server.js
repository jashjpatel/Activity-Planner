const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 5000;
const uri = "mongodb+srv://jash:Fufa@userdatacluster.itnpv.mongodb.net/?retryWrites=true&w=majority&appName=UserDataCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());
app.use(express.json());

// Connecting to MongoDB


client.connect()

.then(async () => {
    console.log("Connected to MongoDB");

    const db = client.db('userData');

    // Ensure 'users' collection exists
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("users");
      console.log("Users collection created!");
    }

    // Ensure 'matches' collection exists
    const matchCollections = await db.listCollections({ name: "matches" }).toArray();
    if (matchCollections.length === 0) {
      await db.createCollection("matches");
      console.log("Matches collection created!");
    }

  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Route for fetching all users (example for profile viewing)
app.get('/api/users', async (req, res) => {
    const db = client.db('userData');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find().toArray();
    res.json(users); // Send the list of users as JSON
  });
  
  // Route for adding a match
  app.post('/api/matches', async (req, res) => {
    const { userId, score } = req.body;
    const db = client.db('userData');
    const matchesCollection = db.collection('matches');
    
    const newMatch = { userId, score, date: new Date() };
    await matchesCollection.insertOne(newMatch);
    
    res.status(201).json(newMatch);  // Respond with the created match
  });
  
  // Route for user login (simple mock)
  // Route for user login (simple mock)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Log the login data to the console
    console.log('Login data received:', { email, password });
  
    const db = client.db('userData');
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ email, password });
    if (user) {
      res.json(user);  // Return user data if login is successful
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
  
  
  // Route for user signup
  // Route for user signup
app.post('/api/signup', async (req, res) => {
    const { name, email, password, age, location } = req.body;
    
    // Log the signup data to the console
    console.log('Signup data received:', { name, email, password, age, location });
  
    const db = client.db('userData');
    const usersCollection = db.collection('users');
    
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    
    const newUser = { name, email, password, age, location };
    await usersCollection.insertOne(newUser);
    
    res.status(201).json(newUser);  // Return the newly created user
  });
  
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

//mongoose.connect("mongodb://localhost/users", {useNewUrl})
 //   .then(() => console.log("Connected to MongoDB"))
  //  .catch(err => console.error("MongoDB connection error:", err));

//app.listen(3000, () => console.log("Server is running on port 3000"));

//mongodb+srv://jash:Fufa@userdatacluster.itnpv.mongodb.net/?retryWrites=true&w=majority&appName=UserDataCluster
