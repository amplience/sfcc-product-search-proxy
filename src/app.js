const express = require('express');
const router = require('./router');
const cors = require('cors');

const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

module.exports = app;
