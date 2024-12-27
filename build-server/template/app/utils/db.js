require('dotenv').config("../");

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on("error", (err)=>{
    console.log(err);
})
