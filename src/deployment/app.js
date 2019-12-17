const express = require('express');
const router = require('../router');
const cors = require('cors');

const app = express();

app.use(cors({origin: 'null'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

module.exports = app;
