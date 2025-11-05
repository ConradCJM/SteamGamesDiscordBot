const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();

// Your IDs from the Discord Developer Portal
const clientId = process.env.CLIENT_ID; // Application (client) ID
const guildId = process.env.GUILD_ID;   // Test server ID
const token = process.env.BOT_TOKEN;    // Bot token

// Load all command files
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Register commands with Discord
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`🔄 Refreshing ${commands.length} application (/) commands...`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('✅ Successfully reloaded application (/) commands.');

        // console.log(`🔄 Refreshing ${commands.length} global commands...`);
        // await rest.put(
        //   Routes.applicationCommands(clientId),
        //   { body: commands },
        // );
        // console.log('✅ Global commands updated.');
    } catch (error) {
        console.error(error);
    }
})();
