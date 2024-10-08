const express = require('express');

const app = express();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin','X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS')
    next();
});

app.use('/api/posts',(req,res,next)=>{
    const posts = [
        {
            id:'1',
            title:'irene1',
            content:'irene1'
        },
        {
            id:'2',
            title:'irene2',
            content:'irene2'
        },
    ];
    res.status(200).json({
        message: 'Post fecthed sucessfully',
        posts: posts
    });
});

module.exports = app;
