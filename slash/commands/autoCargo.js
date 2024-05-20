const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autocargos")
        .setDescription("Configura os cargos padrões para novos usuários."),
    async execute(interaction) {
        const { guild, client } = interaction;

        // Obtém todos os cargos disponíveis no servidor, excluindo '@everyone'
        const roles = guild.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => ({ label: role.name, value: role.id }));

        if (roles.length === 0) {
            console.log("Nenhum cargo disponível para configurar.");
            return interaction.reply({ content: "Não há cargos disponíveis para configurar.", ephemeral: true });
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-default-roles')
                    .setPlaceholder('Selecione os cargos padrão: ')
                    .addOptions(roles)
                    .setMinValues(1)
                    .setMaxValues(roles.length)
            );
        const embed = new EmbedBuilder()
            .setColor("#00ffff")
            .setTitle("Configuração de Cargos Padrão")
            .setDescription("Selecione os cargos que serão atribuídos automaticamente a novos usuários.");

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
        console.log("seleção foi");
        // Adiciona um listener de interação de componentes para lidar com a seleção
        const filter = i => i.customId === 'select-default-roles' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedRoleIds = i.values;

            // Salva os cargos selecionados em um arquivo JSON
            fs.writeFileSync('defaultRoles.json', JSON.stringify(selectedRoleIds));
            console.log("Cargos salvos");
            await i.update({
                content: "Cargos padrão configurados com sucesso.",
                components: [],
                embeds: [],
                ephemeral: true
            });
        });
        //erro
        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp({ content: 'Você não selecionou nenhum cargo.', ephemeral: true });
            }
        });
    }
};