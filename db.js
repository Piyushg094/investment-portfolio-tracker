const mongoose = require('mongoose');

const connectDB = async ()=>{
        try{
            const connect = await mongoose.connect(process.env.MONGO_KEY, {});
            console.log(`MongoDB connected: ${connect.connection.host}`);
        }catch(err){
            console.log('error to connect DB',err)
            process.exit(1)
        }

}

module.exports = connectDB