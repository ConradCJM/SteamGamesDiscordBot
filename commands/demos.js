const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('demos')
        .setDescription('Lists current demos on Steam'),
    async execute(interaction) {
        await interaction.deferReply();
        try{
            // 🔹 Fetch up to 3 pages of deals
            let demos = [];
            

            
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&lowerPrice=0&upperPrice=0`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Request failed: ${res.status} ${text}`);
            }
            demos = await res.json();
            
            

            const demosEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🕹️ Steam Demos')
            .setTimestamp();

            if (demos.length === 0) {
                demosEmbed.setDescription('There are currently no demos available on Steam.');
            }
            else{
                demosEmbed.setDescription('Here are the currently available demos on Steam:');
                // Add demo fields dynamically here
            }
        // dynamically add fields here based on API data
        await interaction.editReply({ embeds: [demosEmbed] });
        }
        catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error executing this command!', ephemeral: true });
        }










        
    },
};
