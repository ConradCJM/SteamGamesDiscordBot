const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sales')
        .setDescription('Shows current Steam games on sale'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            // 🔹 Fetch up to 3 pages of deals
            let deals = [];
            let pageNum = 0;
            const maxPages = 3;
            let hasMore = true;

            while (hasMore && pageNum < maxPages) {
                const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&isOnSale=1&pageSize=60&pageNumber=${pageNum}`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Request failed: ${res.status} ${text}`);
                }

                const pageDeals = await res.json();
                if (pageDeals.length === 0) {
                    hasMore = false;
                } else {
                    deals = deals.concat(pageDeals);
                    pageNum++;
                }
            }

            // 🔹 Filter out spammy or fake deals
            deals = deals.filter(deal =>
                deal.isOnSale === "1" &&
                parseFloat(deal.normalPrice) < 100 &&
                parseFloat(deal.normalPrice) > parseFloat(deal.salePrice)
            );

            // 🔹 Pagination setup
            const pageSize = 10;
            let page = 0;

            const generateEmbed = (page) => {
                const start = page * pageSize;
                const currentDeals = deals.slice(start, start + pageSize);

                const embed = new EmbedBuilder()
                    .setColor(0x1b2838)
                    .setTitle(`🔥 Steam Sales (Page ${page + 1}/${Math.ceil(deals.length / pageSize)})`)
                    .setTimestamp();

                currentDeals.forEach(deal => {
                    embed.addFields({
                        name: `${deal.title} — ${Math.floor(deal.savings)}% off`,
                        value: `~~$${deal.normalPrice}~~ → **$${deal.salePrice}**\n[View on Steam](https://store.steampowered.com/app/${deal.steamAppID})`,
                        inline: false
                    });
                });

                return embed;
            };

            const row = () => new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('prev').setLabel('⬅️ Prev').setStyle(ButtonStyle.Primary).setDisabled(page === 0),
                new ButtonBuilder().setCustomId('next').setLabel('Next ➡️').setStyle(ButtonStyle.Primary).setDisabled((page + 1) * pageSize >= deals.length)
            );

            const message = await interaction.editReply({ embeds: [generateEmbed(page)], components: [row()] });

            const collector = message.createMessageComponentCollector({ time: 150000 });

            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: "This isn't your menu!", ephemeral: true });
                }

                if (i.customId === 'prev' && page > 0) page--;
                else if (i.customId === 'next' && (page + 1) * pageSize < deals.length) page++;

                await i.update({ embeds: [generateEmbed(page)], components: [row()] });
            });

            collector.on('end', async () => {
                await message.edit({ components: [] }); // disable buttons after timeout
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply('⚠️ Could not fetch sales right now.');
        }
    },
};
