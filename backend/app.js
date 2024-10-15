const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require("./routes/posts");
const app = express();

mongoose.connect("mongodb+srv://itbevmiprinter:PjoqgjL563lZsaAd@cluster0.izl8m.mongodb.net/node-angular?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log('Connected to Database');
}).catch(()=>{
    console.log('Connected Failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH,PUT, DELETE, OPTIONS"
    );
    next();
  });

app.use("/api/posts",postsRoutes);

module.exports = app;
