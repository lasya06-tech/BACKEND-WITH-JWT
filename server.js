const express=require('express');
const connectdb=require('./config/db');

const app=express();

app.get('/',(req,res)=>res.send('API IS RUNNING'));

//init middlewear
app.use(express.json());

//Define Routes
app.use('/api/users',require('./api/users'));
app.use('/api/profile',require('./api/profile'));
app.use('/api/posts',require('./api/posts'));
app.use('/api/auth',require('./api/auth'));

connectdb();


const port=process.env.port||5000;

app.listen(port,()=>console.log(`Server is Running on port ${port}`));
 