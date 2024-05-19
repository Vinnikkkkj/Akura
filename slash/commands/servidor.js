const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const { format } = require("date-fns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servidor")
    .setDescription("Mostra informações sobre o servidor!"),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = guild.members.cache.get(guild.ownerId);
    const embed = new EmbedBuilder()
      .setColor("#00bfff")
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL() || null)
      .setDescription(
        `**Dono:** ${owner ? owner.user.tag : "Indisponível"}\n**Membros:** ${
          guild.memberCount
        }`
      )
      .addFields(
        {
          name: "Canais de Texto",
          value: guild.channels.cache
            .filter((channel) => channel.type === ChannelType.GuildText)
            .size.toString(),
          inline: true,
        },
        {
          name: "Canais de Voz",
          value: guild.channels.cache
            .filter((channel) => channel.type === ChannelType.GuildVoice)
            .size.toString(),
          inline: true,
        }
      );

    // Optional: Format creation date
    const formattedDate = format(guild.createdAt, "dd/MM/yyyy");
    embed.addFields({ name: "Criado em:", value: formattedDate, inline: true });

    await interaction.reply({ embeds: [embed] });
  },
};
