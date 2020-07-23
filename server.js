const express = require('express');


const App = express();

App.get('/', (req,res)=>{res.send('API runing on this port')});


const PORT = process.env.PORT || 8080;


App.listen(PORT, ()=>{console.log(`server start on ${PORT}`)});