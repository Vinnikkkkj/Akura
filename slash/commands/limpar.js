const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limpar") // Command name in Portuguese
    .setDescription("Limpa mensagens de texto no chat.")
    .addIntegerOption(
      (option) =>
        option
          .setName("quantidade")
          .setDescription("Quantidade de mensagens a serem limpas.")
          .setMinValue(1)
          .setMaxValue(100)
          .setRequired(true)
    ),
  async execute(interaction) {
    const amountToDelete = interaction.options.getInteger("quantidade");

    const channel = interaction.channel;

    if (channel.type === ChannelType.DM) {
      interaction.reply(
        "Este comando não pode ser usado em mensagens privadas."
      );
      return;
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      interaction.reply("Você não tem permissão para usar este comando.");
      return;
    }

    try {
      await channel.bulkDelete(amountToDelete);

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription(`**${amountToDelete} mensagens foram limpas!**`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply("Ocorreu um erro ao limpar as mensagens.");
    }
  },
};
