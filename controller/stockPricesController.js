const Stocks = require('../models/stock')
const User = require('../models/stockUser')
const axios = require('axios');

exports.addUserStocks = async (req,res) => {
      try{
        console.log(req.body)
        const userData = req.user;

        const userId = userData.id;

        const data = req.body;
      
        const stockData =  new Stocks({...data, userId:userId})
        const response =  await stockData.save();
        res.status(200).json({message:"new stock in added in your portfolio", data: response});
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.getUserStocks = async (req , res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const response =  await Stocks.find({userId});
        res.status(200).json({message:"data fetched successfully", data: response});
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.updateUserStocks = async (req , res)=>{
    try{
        const stockId = req.params.stockId;
        const userId = req.user.id;
        const updatedData = req.body;
        const stock =  await Stocks.findOne({ _id : stockId, userId : userId});
        if(!stock){
            return res.status(404).json({ message: "Stock not found or unauthorized" }); 
        }
        const updatedStock = await Stocks.findByIdAndUpdate(
            stockId,
            { $set: updatedData },
            { new: true, runValidators: true }
          );
          res.status(200).json({
            message: "Stock updated successfully",
            data: updatedStock
          });
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error', error : err});
    }
};

exports.deleteUserStock = async (req, res) => {
    try {
      const stockId = req.params.stockId;
      console.log(stockId)
      const userId = req.user.id; // from JWT token
  
      // Ensure the stock belongs to the current user
      const stock = await Stocks.findOne({ _id: stockId, userId: userId });
  
      if (!stock) {
        return res.status(404).json({ message: "Stock not found or unauthorized" });
      }
  
      await Stocks.deleteOne({ _id: stockId });
  
      res.status(200).json({ message: "Stock deleted successfully" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  };


  exports.showStockMatrix = async (req, res) => {
    const apiKey = process.env.YOUR_API_KEY; // Replace with your key
    const userId = req.user.id; // from JWT token
    const fetchSymbol = await Stocks.find({userId})
    console.log(fetchSymbol)
    const symbol = fetchSymbol.map((ticker)=>{
         return ticker.ticker
    })
    const quantityArr = fetchSymbol.map((quantity)=>{
        return quantity.quantity
   })
   

    const symbolString = symbol.join(',')
    let URL =  `https://api.twelvedata.com/time_series?symbol=${symbolString}&interval=1h&outputsize=1&apikey=${apiKey}`

    let realTimePriceObj = []
    let i=0
    try {
      const response = await axios.get(URL);
      const data=response.data
      console.log(data)
      if(response){
       for( const ticker in data){
         const stock = data[ticker];
         if(stock.values && stock.values.length > 0){
            stock.values.forEach(entry => {
                realTimePriceObj.push({
                    ticker: ticker,               // keep ticker symbol
                    high: parseFloat(entry.high), // store high value separately
                    quantity: quantityArr[i]      // quantity from array
                  });
              });
         }
         i++;
       }

    }
    let totalValues = 0;
    let totalStock = [], topPerformanceStock = {}
    let portfolioDistribution = {}
//calculate totalValues
    totalStock= realTimePriceObj.map((num)=>{
        totalValues+=num.quantity *num.high
        return { high :num.quantity *num.high, ticker : num.ticker}
    })
    
    totalStock.sort((a,b)=> {
        return b.high-a.high
    })
    //calculate topPerformanceStock
    topPerformanceStock = {
           name  :totalStock[0].ticker,
           value : totalStock[0].high
    }
    //calculate portfolioDistribution
    totalStock.forEach(stock => {
        const percentage = (stock.high / totalValues) * 100;
        portfolioDistribution[stock.ticker] = percentage.toFixed(2).toString()+'%'; // keeping 2 decimals
      });
            
    const result = {
        status : true,
        message :{
            totalValue : totalValues,
            topPerformanceStock :topPerformanceStock,
            portfolioDistribution:portfolioDistribution
        }
    }

    res.status(200).json({message : "fetched data successfully", data :result})

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  


  exports.showStocksRealTimePrices = async (req,res)=>{

    try{
        const apiKey = process.env.YOUR_API_KEY; // Replace with your key
        const userId = req.user.id; // from JWT token
        const fetchSymbol = await Stocks.find({userId})
        const symbol = fetchSymbol.map((ticker)=>{
             return ticker.ticker
        })      
        const symbolString = symbol.join(',')
        let URL =  `https://api.twelvedata.com/time_series?symbol=${symbolString}&interval=1h&outputsize=1&apikey=${apiKey}`
    
        const response = await axios.get(URL);
        const data=response.data
        res.status(200).json({message:"real-Time stocks data", data:data})

    }catch(err){
        console.error('Error fetching data:', error.message);
    }
  }