const axios = require('axios');
const { SHOP_API_URL } = require('../config');

async function fetchShop() {
  const res = await axios.get(SHOP_API_URL);
  return res.data.data.entries || [];
}

function extractItemIds(entries) {
  const ids = [];

  for (const entry of entries) {
    if (!entry.brItems) continue;

    for (const item of entry.brItems) {
      ids.push(item.id);
    }
  }

  return ids;
}

module.exports = { fetchShop, extractItemIds };