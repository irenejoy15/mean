// IMPORT HTTP

const http = require('http');
const server = http.createServer((req,res)=>{
    res.end('THIS IS MY FIRST RESPONSE');
});

server.listen(process.env.PORT || 3000);