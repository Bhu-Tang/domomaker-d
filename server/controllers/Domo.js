const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.color) {
    return res.status(400).json({ error: 'Name, age, and color are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    color: req.body.color,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, color: newDomo.color, });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists! ' });
    }
    return res.status(500).json({ error: 'An error occured making the Domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age color').lean().exec();
    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retriving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    // const newDomo = new Domo(domoData);
    await Domo.deleteOne({_id: req.body._id});
    console.log(`${req.body._id} deleted!`);
    return res.status(201).json({ id: req.body._id});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists! ' });
    }
    return res.status(500).json({ error: 'An error occured deleting the Domo!' });
  }

};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
