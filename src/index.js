const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const { TOKEN } = require('./config');
const { getOrCreateShopChannel } = require('./discord/channelService');
const { checkShop } = require('./jobs/shopJob');
const { fetchShop, extractItemIds } = require('./services/shopService');
const { saveItems, loadSavedItems } = require('./services/storageService');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { buildItemEmbed } = require('./discord/embedBuilder');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  await registerCommands(client);

  const channel = await getOrCreateShopChannel(client);
  if (!channel) return;

  await checkShop(channel);

  cron.schedule('*/10 * * * *', () => {
    checkShop(channel);
  });
});

async function registerCommands(client) {

  const commands = [
    new SlashCommandBuilder()
      .setName('syncshop')
      .setDescription('Silently sync current shop without posting.')
      .toJSON(),

    new SlashCommandBuilder()
      .setName('rendershop')
      .setDescription('Render all items from shop.json again.')
      .toJSON()
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log('Slash commands registered.');
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'syncshop') {

    const entries = await fetchShop();
    const ids = extractItemIds(entries);

    saveItems(ids);

    return interaction.reply({
      content: 'Shop synced successfully. No messages were posted.',
      ephemeral: true
    });
  }

  if (interaction.commandName === 'rendershop') {

    await interaction.reply({
      content: 'Rendering saved shop items...',
      ephemeral: true
    });

    const channel = interaction.channel;
    const entries = await fetchShop();
    const savedIds = loadSavedItems();

    if (!savedIds.length) {
      return interaction.followUp({
        content: 'shop.json is empty.',
        ephemeral: true
      });
    }

    await channel.send('@everyone **Today\'s Fortnite Shop (Restored)**');

    for (const entry of entries) {
      if (!Array.isArray(entry.brItems)) continue;

      for (const item of entry.brItems) {
        if (savedIds.includes(item.id)) {
          const embed = buildItemEmbed(entry, item);
          await channel.send({ embeds: [embed] });
        }
      }
    }
  }
});

client.login(TOKEN);
