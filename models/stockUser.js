const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    createAt :{
        type : Date,
        defualt : Date.now
    },
    updatedAt :{
        type : Date,
        defualt : Date.now
    }

})

module.exports = mongoose.model('Person',userSchema)