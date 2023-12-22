const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qp2qmz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors());
app.use(express.json());

async function run() {
    try {
        // await client.connect();

        const userCollection = client.db("organizerDB").collection("users");
        const todoCollection = client.db("organizerDB").collection("todo");
        const moderatorCollection = client.db("organizerDB").collection("moderator");
        const completedCollection = client.db("organizerDB").collection("completed");

        // All user
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        // store user data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exist', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // add task
        app.post('/todo', async (req, res) => {
            const task = req.body;
            const result = await todoCollection.insertOne(task);
            res.send(result)
        })

        // get todo task
        app.get('/todo', async (req, res) => {
            const result = await todoCollection.find().toArray();
            res.send(result)
        })

        // Delete task
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await todoCollection.deleteOne(query);
            res.send(result)
        })


    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})