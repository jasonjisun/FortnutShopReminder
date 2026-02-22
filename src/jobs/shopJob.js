const { fetchShop, extractItemIds } = require('../services/shopService');
const { loadSavedItems, saveItems } = require('../services/storageService');
const { buildItemEmbed } = require('../discord/embedBuilder');

async function checkShop(channel) {
  const entries = await fetchShop();
  const currentIds = extractItemIds(entries);
  const savedIds = loadSavedItems();

  const newIds = currentIds.filter(id => !savedIds.includes(id));

  if (savedIds.length > 0 && newIds.length > 0) {
    await channel.send('@everyone New shop items!');

    for (const entry of entries) {
      for (const item of entry.brItems || []) {
        if (newIds.includes(item.id)) {
          await channel.send({
            embeds: [buildItemEmbed(entry, item)]
          });
        }
      }
    }
  }

  saveItems(currentIds);
}

module.exports = { checkShop };