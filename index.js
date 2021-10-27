const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://shihab1:XhFrvgEfllhyE05U@cluster0.sg7hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Students");
        const usersCollection = database.collection("users");

        //get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            console.log(users);
            res.send(users);
        })

        //get api to get one data
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('Find Query: ', query);
            const result = await usersCollection.findOne(query);
            console.log('Finding user data:  ', result);
            res.json(result);
        })

        //post api
        app.post('/users', async (req, res) => {
            console.log('new data : ', req.body);
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log(`Added user at index: ${result.insertedId}`);
            // res.send('Success');
            res.json(result);
        })

        //update api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log('updating user: ', user);
            res.send(result);
        });


        //delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('deleting user with id ', result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running My Server!!");
})

app.listen(port, () => {
    console.log('running server on port: ', port)
})