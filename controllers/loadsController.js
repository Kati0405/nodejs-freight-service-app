const { Load } = require('../models/Load');

const getLoads = async (req, res) => {
  Load.find({ userId: req.user.userId })
    .then((loads) => {
      res.status(200).send({ loads });
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const createLoad = async (req, res) => {
  const createdBy = req.user.id;
  const { name, payload, pickupAddress, deliveryAddress, dimensions } =
    req.body;
  const load = new Load({
    name,
    payload,
    pickupAddress,
    deliveryAddress,
    dimensions,
    createdBy,
  });
  load
    .save()
    .then((result) => {
      res.status(200).send({ message: 'Load created successfully', result });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const getLoadById = async (req, res) => {
  const { id } = req.params;
  return Load.findById(id)
    .then((result) => {
      res.status(200).send({ message: 'Success', load: result });
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

const updateLoadById = async (req, res) => {
  const { name, payload, pickupAddress, deliveryAddress, dimensions } =
    req.body;
  await Load.findByIdAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.createdBy,
    },
    {
      $set: {
        name,
        payload,
        pickupAddress,
        deliveryAddress,
        dimensions,
      },
    },
  );
  res.status(200).send({ message: 'Load details changed successfully' });
};

const deleteLoadById = async (req, res) => {
  Load.findById(req.params.id)
    .then((load) => {
      if (!load) {
        res.status(404).json({ message: 'Load not found' });
      } else {
        load.delete();
        res.status(200).send({ message: 'Load deleted successfully' });
      }
    })
    .catch(() => {
      res.status(400).send('Error');
    });
};

module.exports = {
  getLoads,
  createLoad,
  getLoadById,
  updateLoadById,
  deleteLoadById,
};
