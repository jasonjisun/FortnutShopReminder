const fs = require('fs');
const { SHOP_FILE } = require('../config');

function loadSavedItems() {
  if (!fs.existsSync(SHOP_FILE)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(SHOP_FILE));
    return data.savedItems || [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  fs.writeFileSync(
    SHOP_FILE,
    JSON.stringify({ savedItems: items }, null, 2)
  );
}

module.exports = { loadSavedItems, saveItems };