const pool = require('./path/to/pool');

const TradeModel = {
  getAllTrades: async () => {
    const res = await pool.query('SELECT * FROM trades');
    return res.rows;
  },

  addTrade: async (trade) => {
    const { symbol, quantity, price } = trade;
    const res = await pool.query(
      'INSERT INTO trades (symbol, quantity, price) VALUES ($1, $2, $3) RETURNING *',
      [symbol, quantity, price]
    );
    return res.rows[0];
  },

  // Add more methods as needed, e.g., updateTrade, deleteTrade
};

module.exports = TradeModel;
