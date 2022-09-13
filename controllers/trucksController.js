const { Truck } = require('../models/Truck');

const trucksDimentions = {
  SPRINTER: {
    width: 300,
    length: 250,
    height: 170,
    payload: 1700,
  },
  'SMALL STRAIGHT': {
    width: 500,
    length: 250,
    height: 170,
    payload: 2500,
  },
  'LARGE STRAIGHT': {
    width: 700,
    length: 350,
    height: 200,
    payload: 4000,
  },
};

const getTrucks = async (req, res) => {
  await Truck.find({ userId: req.user.userId })
    .then((trucks) => {
      res.status(200).json({ trucks: trucks });
    })
    .catch(() => {
      res.status(400).json('Error');
    });
};

const createTruck = async (req, res) => {
  const createdBy = req.user.id;
  let { type, dimensions } = req.body;
  const defaultDimentions = trucksDimentions[type];
  if (!dimensions && defaultDimentions) {
    dimensions = defaultDimentions;
  }
  const truck = new Truck({
    createdBy,
    type,
    dimensions,
  });
  await truck
    .save()
    .then((result) => {
      res.status(200).json({ message: 'Truck created successfully', result });
    })
    .catch(() => {
      res.status(400).json('Error');
    });
};

const getTruckById = async (req, res) => {
  const { id } = req.params;
  return Truck.findById(id)
    .then((result) => {
      res.status(200).json({ message: 'Success', truck: result });
    })
    .catch(() => {
      res.status(400).json('Error');
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
  res.status(200).send({ message: 'Truck details changed successfully' });
};

const deleteTruckById = async (req, res) => {
  await Truck.findById(req.params.id)
    .then((truck) => {
      if (!truck) {
        res.status(404).json({ message: 'Truck not found' });
      } else {
        truck.delete();
        res.status(200).json({ message: 'Truck deleted successfully' });
      }
    })
    .catch(() => {
      res.status(400).json('Error');
    });
};

const assignTruckById = async (req, res) => {
  try {
    const userId = req.user.id;
    await Truck.updateMany(
      { assignedTo: userId },
      { $set: { assignedTo: null } },
    );
    const assignedTo = req.user.id;
    await Truck.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: { assignedTo } },
    );
    res.status(200).json({ message: 'Truck assigned successfully' });
  } catch {
    res.status(400).json('Error');
  }
};

module.exports = {
  getTrucks,
  createTruck,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  assignTruckById,
};
