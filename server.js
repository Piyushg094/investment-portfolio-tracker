const express = require('express')
const connectDB = require('./db.js')
const app = express()
require('dotenv').config()
const userRouter = require('./routes/auth')
const stocksRouter = require('./routes/stockPrices')

app.use(express.json());


//import routes
app.use('/user', userRouter)
app.use('/api/stocks', stocksRouter)
connectDB()
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`server has started at port ${process.env.PORT}`);
})

