const express = require('express');

const connectDB = require('./config/db');

const App = express();

//connect database

connectDB();

//init middleware


// App.use(bodyParser.json());
App.use(express.json({extended: false}));


App.get('/', (req,res)=>{res.send('API runing on this port')});


App.use('/api/user', require('./routes/api/user'));
App.use('/api/auth', require('./routes/api/auth'));
App.use('/api/profile', require('./routes/api/profile'));
App.use('/api/post', require('./routes/api/post'));


const PORT = process.env.PORT || 8080;


App.listen(PORT, ()=>{console.log(`server start on ${PORT}`)});