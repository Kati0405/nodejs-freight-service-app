const { Load } = require('../models/Load');
const { Truck } = require('../models/Truck');

const getLoads = async (req, res) => {
  Load.find({ userId: req.user.userId })
    .then((loads) => {
      res.status(200).json({ loads });
    })
    .catch(() => {
      res.status(400).json('Error');
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
      res.status(200).json({ message: 'Load created successfully', result });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getLoadById = async (req, res) => {
  const { id } = req.params;
  return Load.findById(id)
    .then((result) => {
      res.status(200).json({ message: 'Success', load: result });
    })
    .catch(() => {
      res.status(400).json('Error');
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
        res.status(200).json({ message: 'Load deleted successfully' });
      }
    })
    .catch(() => {
      res.status(400).json('Error');
    });
};

const postLoadById = async (req, res) => {
  // Шіпер натискає на пост і відбувається пошук трака (ІС + заасайнений драйвер) та пейлоад лоаду менший за пейлоад трака і діменшини менші
  // якщо такий трак знайдено то статус міняється на ассайнд, якщо ні - на нью
  // ця інформаця має бути записана в логи
  try {
    await Load.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: { status: 'POSTED' } },
    );

    const load = await Load.findById(req.params.id);
    const trucks = await Truck.aggregate([
      {
        $match: {
          status: 'IS',
          assignedTo: {
            $ne: null,
          },
          'dimensions.width': {
            $gte: load.dimensions.width,
          },
          'dimensions.length': {
            $gte: load.dimensions.length,
          },
          'dimensions.height': {
            $gte: load.dimensions.height,
          },
          'dimensions.payload': {
            $gte: load.payload,
          },
        },
      },
    ]);
    const truck = trucks ? trucks[0] : null;
    let driver_found;
    if (!truck) {
      driver_found = false;
      await Load.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: { status: 'NEW' },
          $push: { logs: { message: 'No truck found' } },
        },
      );
      res.status(200).json({ message: 'No truck found', driver_found });
    } else {
      driver_found = true;
      await Load.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: {
            status: 'ASSIGNED',
            state: 'En route to Pick Up',
            assignedTo: truck.assignedTo,
          },
          $push: { logs: { message: 'Truck was found' } },
        },
      );
      await Truck.findByIdAndUpdate(
        { _id: truck._id },
        { $set: { status: 'OL' } },
      );
      res.status(200).json({ message: 'Truck was found', driver_found });
    }
  } catch (err) {
    res.status(400).send(err).json('Error');
  }
};

const getActiveLoad = async (req, res) => {
  // load, де асайнд - айді драйвера
  try {
    const driverId = req.user.id;
    const activeLoad = await Load.findOne({ assignedTo: driverId });
    if (!activeLoad) {
      res.status(200).json({ message: 'No active loads', load: activeLoad });
    } else {
      res.status(200).json({ load: activeLoad });
    }
  } catch (err) {
    res.status(400).json('Error');
  }
};

const getLoadShippingInfo = async (req, res) => {
  try {
    const activeLoads = await Load.find({
      _id: req.params.id,
      assignedTo: { $ne: null },
    });
    if (!activeLoads) {
      res.status(200).json({ message: 'No active loads' });
    } else {
      res.status(200).json({ load: activeLoads });
    }
  } catch (err) {
    res.status(400).json('Error');
  }
};

const iterateToNextLoadState = async (req, res) => {
  try {
    const states = [
      'En route to Pick Up',
      'Arrived to Pick Up',
      'En Route to Delivery',
      'Arrived to Delivery',
    ];
    const driverId = req.user.id;
    const activeLoad = await Load.findOne({ assignedTo: driverId });
    console.log(driverId);
    if (!activeLoad) {
      res.status(200).json({ message: 'No active loads' });
    } else {
      const loadState = activeLoad.state;
      console.log(loadState);
      if (loadState !== 'Arrived to Delivery') {
        await activeLoad.updateOne({
          state: states[states.indexOf(loadState) + 1],
        });
        res
          .status(200)
          .json({ message: `Load state changed to '${loadState}'` });
      } else {
        await activeLoad.updateOne({ status: 'SHIPPED' });
        const truck = await Truck.findOne({ assignedTo: driverId });
        await truck.updateOne({ status: 'IS' });
        res
          .status(200)
          .json({ message: `Load state changed to '${loadState}'` });
      }
    }
  } catch (err) {
    res.status(400).json('Error');
  }
};

module.exports = {
  getLoads,
  createLoad,
  getLoadById,
  updateLoadById,
  deleteLoadById,
  postLoadById,
  getActiveLoad,
  getLoadShippingInfo,
  iterateToNextLoadState,
};
