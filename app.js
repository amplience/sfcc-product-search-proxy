const express = require('express');
const router = require('./router');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors({origin: 'null'})); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function(err, req, res, next){
  res.status(400).json(err);
});

app.use('/', router);

module.exports = app;
