const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.reyfrcm.mongodb.net/?retryWrites=true&w=majority`;

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

    const serviceCollection = client.db('serviceDB').collection('service');

    app.get('/service', async(req, res) => {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    app.get('/service/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await serviceCollection.findOne(query);
        res.send(result);
        })

    app.post('/service', async(req, res) => {
        const newService = req.body;
        console.log(newService);
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
    })

    app.put('/service/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updatedService = req.body;
        const service = {
          $set: {
            name: updatedService.name, 
            address: updatedService.address, 
            occupation: updatedService.occupation, 
            mobile: updatedService.mobileNum, 
            details: updatedService.details, 
          }
        }    
        const result = await serviceCollection.updateOne(filter, service, options);  
        res.send(result);  
    })

    app.delete('/service/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
      } )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get ('/', (req, res) => {
    res.send('mohite tex server is running');
})

app.listen(port, () => {
    console.log(`mohite tex server is running on port: ${port}`)
})