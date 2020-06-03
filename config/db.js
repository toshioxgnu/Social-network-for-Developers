const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongo');

const connectDB = async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MONGODB connected...');
        
    }catch(error){  
        console.log(error.message);
        process.exit(1);
    }
}
module.exports = connectDB;