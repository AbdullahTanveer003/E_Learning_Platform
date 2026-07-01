const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')); // Hide part of password

mongoose.set('debug', true);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error(err);
  process.exit(1);
});
