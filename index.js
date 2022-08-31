const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:8081',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

require('dotenv').config();

const app = express();
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://k_kovshykova:verystrongpassword@kkovcluster.gwnk0hh.mongodb.net/freight-service?retryWrites=true&w=majority',
);

app.use(cors(corsOptions));

const { truckRouter } = require('./routes/truckRouter');
const { authRouter } = require('./routes/authRouter');
const { userRouter } = require('./routes/userRouter');
const { loadRouter } = require('./routes/loadRouter');
const { weatherRouter } = require('./routes/weatherRouter');

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/trucks', truckRouter);
app.use('/api/auth', authRouter);
app.use('/api/users/me', userRouter);
app.use('/api/loads', loadRouter);
app.use('/api/weather', weatherRouter);

const start = async () => {
  try {
    app.listen(8080);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

// ERROR HANDLER
function errorHandler(err, req, res) {
  console.error(err.stack);
  res.status(500).send({ message: 'Server error' });
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

app.use(logErrors);
//app.use(errorHandler);
