const { EmbedBuilder } = require('discord.js');

function buildItemEmbed(entry, item) {
  return new EmbedBuilder()
    .setTitle(item.name)
    .setDescription(item.description || 'No description')
    .addFields(
      { name: '💰 Price', value: `${entry.finalPrice} V-Bucks`, inline: true },
      { name: '💎 Rarity', value: item.rarity?.displayValue || 'Unknown', inline: true }
    )
    .setImage(item.images?.featured || item.images?.icon || null)
    .setTimestamp();
}

module.exports = { buildItemEmbed };