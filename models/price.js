const mongoose = require('mongoose')


const stockSchema = new mongoose.Schema({

    stockName : {
        type : String,
        required : true,
    },
    ticker : {
        type : String,
        required : true,
    },
    quantity : {
        type : Number,
        required : true
    },
    buyPrice :{
        type : Number,
        required : true
    },
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Person',
    }

})

module.exports = mongoose.model('Stock',stockSchema)