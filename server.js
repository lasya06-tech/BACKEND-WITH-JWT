const express=require('express');

const app=express();

app.get('/',(req,res)=>res.send('API IS RUNNING'));

const port=process.env.port||5000;

app.listen(port,()=>console.log(`Server is Running on port ${port}`));
