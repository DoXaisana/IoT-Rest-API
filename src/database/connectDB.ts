import mongoose from 'mongoose';

const MONGODB_URL = 'mongodb+srv://IoT-Admin:u4ASlefUYqKYq6TI@iot-api.20ytlbo.mongodb.net/?retryWrites=true&w=majority'//mongoDB_URL

const connectDB =async () => {
    try {

        mongoose.Promise = Promise;
        mongoose.connect(MONGODB_URL);
        
        mongoose.connection.on(`connected`, () => {
            console.log(`Connected to MongoDB`);
        });
        
        
    }catch {
        mongoose.connection.on(`error`, (err) => {
            console.log(`MongoDB connection err: ${err}`);
        });
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;