const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usuário")
    .setDescription("Fornece informações sobre o usuário."),
  async execute(interaction) {
    const usuario = interaction.user;
    const membro = interaction.member;
    const embed = new EmbedBuilder()
      .setColor("#00ffff")
      .setTitle(`${usuario.username} (ID: ${usuario.id})`)
      .setThumbnail(usuario.displayAvatarURL())
      .addFields(
        { name: "Apelido", value: membro.nickname || "Nenhum", inline: true },
        {
          name: "Entrou no Servidor",
          value: membro.joinedAt.toLocaleDateString("pt-BR"),
          inline: true,
        },
        {
          name: "Conta Criada",
          value: usuario.createdAt.toLocaleDateString("pt-BR"),
          inline: true,
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
