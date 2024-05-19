const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifica a latência e o status da conexão com o Discord!"),
  async execute(interaction) {
    const sentMessage = await interaction.reply({
      content: "Pingando...",
      fetchReply: true,
    });

    const embed = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(
        `Latência: ${
          sentMessage.createdTimestamp - interaction.createdTimestamp
        }ms`
      );

    const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;
    if (latency > 400) {
      embed
        .setColor("#ff0000")
        .setDescription(
          `**Aviso! A latência está muito alta.**\nLatência: ${latency}ms`
        );
    } else if (latency > 200) {
      embed
        .setColor("#ffff00")
        .setDescription(
          `**Aviso, a latência está um pouco alta.**\nLatência: ${latency}ms`
        );
    } else {
      embed.setColor("#00ff00");
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
