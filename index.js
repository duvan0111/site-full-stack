import  express  from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv";
import path from "path";

const app = express()
const port = 4000
const routes = express.Router()
const public_path = path.join(__dirname, './build')


app.use(express.json());
app.use(cors())
app.use("/post", routes)

app.use(express.static(public_path, ))
app.get("*", (_, res) => {
  res.sendFile(path.join(public_path, 'index.html'))
})


dotenv.config()

const uri = process.env.STRING_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("blog").command({ ping: 1 });
    
    // console.log(collections);
    console.log("Pinged your deployment test. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



routes.get("/", (_, res)=>{
  async function run() {
    await client.connect();
    const findOneResult = await client.db("blog").collection("posts").find().toArray()

    if (findOneResult === null) {
      console.log("Couldn't find any recipes that contain 'potato' as an ingredient.\n");
    } else {
      console.log(`Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(findOneResult)}\n`);

      res.status(200).send(findOneResult)
    }

  }
  run().catch(console.dir);
    // res.send("hello Express")
})

const obj = {title: "title", content: "content..."}

routes.post("/insert", (req, res) => {
  async function run(){
    try {
      await client.connect();
      const insertManyResult = await client.db("blog").collection("posts").insertOne(req.body);
      console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
      const findOneResult = await client.db("blog").collection("posts").find().toArray()
      res.status('200').send(findOneResult)
    } catch (err) {
      console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }
  }
  run().catch(console.dir);
})

app.listen(port, ()=>{
    console.log("demarrage avec success du serveur");
})