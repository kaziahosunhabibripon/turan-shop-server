const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

require('dotenv').config();

const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    console.log('Database connected');

    app.post('/addProduct',(req, res)=>{
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res)=>{
        productsCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res)=>{
        productsCollection.find({key:req.params.key})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys',(req, res)=>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.post('/addOrder',(req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result=>{
            
            res.send(result.insertedCount > 0);
        })
    })


});





app.get('/', (req, res) => {
    res.send("Ema-john is responding!");
})
app.listen(port)