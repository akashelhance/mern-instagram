const path = require('path');
const express= require('express')
const dotenv = require('dotenv');
const authroutes= require('./routes/auth')


const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database

connectDB();
const app = express()
//Bosy parser- To read the data from the user:

app.use(express.json());
// Mouting the users:


app.use('/api/',authroutes)

app.use('/', (req,res)=>{
    res.json({"msg": "The api is running"})
})

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
