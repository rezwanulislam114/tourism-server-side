const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdrs3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('trip');
        const offerCollection = database.collection('offer')
        const cartCollection = database.collection('cart')

        // GET API 
        app.get('/offers', async (req, res) => {
            const cursor = offerCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        })

        // POST API 
        app.post('/offers', async (req, res) => {
            const offer = req.body;
            const result = await offerCollection.insertOne(offer)
            res.json(result);
        })

        // DELETE API 
        app.delete('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await offerCollection.deleteOne(query);
            res.json(result);
        })

        // GET SINGLE API
        app.get('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await offerCollection.findOne(query);
            res.json(result)
        })

        // POST CART API 
        app.post('/cart', async (req, res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            console.log(result)
            res.json(result);
        })

        // GET CART API 
        app.get('/cart/:email', async (req, res) => {
            const { email } = req.params;
            const result = await cartCollection.find({ email: email }).toArray()
            res.send(result)
        })

        app.delete('/offers/:email/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            // const result = await cartCollection.deleteOne(query);
            // res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

// initialize database checking 
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})