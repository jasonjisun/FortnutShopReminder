const { ChannelType } = require('discord.js');
const { SHOP_CATEGORY_NAME, SHOP_CHANNEL_NAME } = require('../config');

async function getOrCreateShopChannel(client) {
  const guild = client.guilds.cache.first();
  if (!guild) return null;

  let channel = guild.channels.cache.find(
    c => c.name === SHOP_CHANNEL_NAME && c.type === ChannelType.GuildText
  );

  if (channel) return channel;

  let category = guild.channels.cache.find(
    c => c.name === SHOP_CATEGORY_NAME && c.type === ChannelType.GuildCategory
  );

  if (!category) {
    category = await guild.channels.create({
      name: SHOP_CATEGORY_NAME,
      type: ChannelType.GuildCategory
    });
  }

  return await guild.channels.create({
    name: SHOP_CHANNEL_NAME,
    type: ChannelType.GuildText,
    parent: category.id
  });
}

module.exports = { getOrCreateShopChannel };