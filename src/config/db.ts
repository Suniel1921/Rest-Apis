import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async ()=>{
  try {
    mongoose.connection.on('connected',()=>{
        console.log('Database Connected Successfully');
    })

    mongoose.connection.on('error', (err)=>{
        console.log('Error in Connecting to Database', err)
    })
    
    await  mongoose.connect(config.databaseUrl as string);

    
    
  } catch (error) {
    console.error('Failed to Connected Datbase', error);
    process.exit(1);
    
  }

}

export default connectDB;