import express from 'express';

const app = express();

//routes
//https methods -- GET, POST, PUT, PATCH, DELETE

app.get('/',(req, res, next)=>{
    res.json({message: "welcome to the ebook api"})
})


export default app;