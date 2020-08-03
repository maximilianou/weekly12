// ./api/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.get('/', function(req, res){
  res.send('hello');
} );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening in port : ${PORT}`);
});
