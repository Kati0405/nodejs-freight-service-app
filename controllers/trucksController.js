const { Truck } = require('../models/Truck');

const getTrucks = async (req, res) => {
  Truck.find({ userId: req.user.userId })
    .then((trucks) => {
      res.status(200).send({ trucks });
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const createTruck = async (req, res) => {
  const createdBy = req.user.id;
  const { type } = req.body;
  const truck = new Truck({
    createdBy,
    type,
  });
  truck
    .save()
    .then((result) => {
      res.status(200).send({ message: 'Truck created successfully', result });
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const getTruckById = async (req, res) => {
  const { id } = req.params;
  return Truck.findById(id)
    .then((result) => {
      res.status(200).send({ message: 'Success', truck: result });
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const updateTruckById = async (req, res) => {
  const { type } = req.body;
  await Truck.findByIdAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.createdBy,
    },
    { $set: { type } },
  );
  res
    .status(200)
    .send({ message: 'Truck details changed successfully' })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const deleteTruckById = async (req, res) => {
  Truck.findById(req.params.id)
    .then((truck) => {
      if (!truck) {
        res.status(404).json({ message: 'Truck not found' });
      } else {
        truck.delete();
        res.status(200).send({ message: 'Truck deleted successfully' });
      }
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const assignTruckById = async (req, res) => {};

module.exports = {
  getTrucks,
  createTruck,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  assignTruckById,
};
