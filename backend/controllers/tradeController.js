const TradeModel = require('../models/tradeModel');

exports.getAllTrades = async (req, res) => {
  try {
    const trades = await TradeModel.getAllTrades();
    res.json(trades);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

exports.addTrade = async (req, res) => {
  const newTrade = req.body;
  try {
    const addedTrade = await TradeModel.addTrade(newTrade);
    res.json(addedTrade);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};
