require('dotenv').config();

module.exports = {
  TOKEN: process.env.TOKEN,
  SHOP_FILE: 'shop.json',
  SHOP_API_URL: 'https://fortnite-api.com/v2/shop',
  SHOP_CATEGORY_NAME: 'Fortnite Shop',
  SHOP_CHANNEL_NAME: 'shop-updates'
};