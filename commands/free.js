const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('free')
        .setDescription('Lists current free Steam games'),
    async execute(interaction) {
        const freeEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🎮 Free Steam Games')
            .setDescription('Here are the currently free games on Steam:')
            .setFooter({ text: 'Use /free to refresh this list' })
            .setTimestamp();
        // dynamically add fields here based on API data
        await interaction.reply({ embeds: [freeEmbed] });
    },
};
