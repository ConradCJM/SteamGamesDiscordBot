const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists available commands'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('📖 Help Menu')
            .setDescription('Here are the available commands for this bot:')
            .addFields(
                { name: '/help', value: 'Lists available commands', inline: false },
                { name: '/sales', value: 'Lists current Steam games on sale', inline: false },
                { name: '/free', value: 'Lists current free Steam games', inline: false },
                { name: '/demos', value: 'Lists current demos on Steam', inline: false },
            )
            .setFooter({ text: 'Use /command to run a command' })
            .setTimestamp();
        await interaction.reply(
            { embeds: [helpEmbed] });
    },
};
