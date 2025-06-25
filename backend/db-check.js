const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to check MongoDB connection
const checkDbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connection Successful ✅');
    console.log('Connection String:', process.env.MONGO_URI);
    console.log('Connection State:', mongoose.connection.readyState);
    console.log('Database Name:', mongoose.connection.db.databaseName);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('MongoDB Connection Failed ❌');
    console.error('Error Details:', error.message);
    
    return false;
  }
};

// Execute the check
checkDbConnection().then(result => {
  if (result) {
    console.log('MongoDB check completed successfully. Your database is ready to use.');
  } else {
    console.log('MongoDB check failed. Please check your connection string and ensure MongoDB is running.');
  }
  
  // Exit the process
  process.exit(result ? 0 : 1);
});
