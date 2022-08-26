const express = require('express');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://k_kovshykova:verystrongpassword@kkovcluster.gwnk0hh.mongodb.net/freight-service?retryWrites=true&w=majority',
);

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
  console.error(err);
  res.status(500).send({ message: 'Server error' });
}

app.use(errorHandler);
