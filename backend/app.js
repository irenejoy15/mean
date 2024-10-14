const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post')
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

app.post("/api/posts",(req,res,next)=>{
    const post= new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save().then(createdPost=>{
        console.log(createdPost);
        res.status(201).json({
            message: 'POST ADD SUCCESSFULLY',
            postId: createdPost._id
        });
    });
});

app.get('/api/posts',(req,res,next)=>{
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Post fecthed sucessfully',
                posts: documents
            });
        });
    ;
    
});

app.get("/api/post/:id",(req,res,next)=>{
    Post.findById(req.params.id).then(post =>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post Not Found'});
        }
    });
});

app.put("/api/post/:id",(req,res,next)=>{
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content:req.body.content
    });
    Post.updateOne({_id:req.params.id},post)
    .then(result=>{
        res.status(200).json({message: 'Update Successfully'});
    });
    ;
});

app.delete('/api/posts/:id',(req,res,next)=>{
    Post.deleteOne({_id:req.params.id})
    .then(result=>{
        console.log(result);
        res.status(200).json({message: 'Post Deleted'});
    });
});

module.exports = app;
