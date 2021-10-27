const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000

const uri = "mongodb+srv://shihab1:kMSNX7dAGuNXGpvn@cluster0.sg7hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("myDb").collection("users");
    // perform actions on the collection object
    console.log('hitting the database');
    const user = { name: 'Shihab', email: "shihabchtg@gmail.com", phone: "343532" }
    console.log('want to insert ', user);
    collection.insertOne(user)
        .then((result) => {
            console.log('insert success with insert id: ', result.insertedId);
        })
    // client.close();
});

app.get('/', (req, res) => {
    res.send("Running My Server");
})

app.listen(port, () => {
    console.log('running server on port: ', port)
})