const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const deploy = require("./deploy-commands");
require("dotenv").config();
const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, "slash");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[AVISO] O comando em ${filePath} está faltando uma propriedade "data" ou "execute" necessária.`
      );
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Pronto! Logado como ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(
      `Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`
    );
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Houve um erro ao executar este comando!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Houve um erro ao executar este comando!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const defaultRolesFile = path.join(__dirname, 'defaultRoles.json');

  if (fs.existsSync(defaultRolesFile)) {
    const defaultRoles = JSON.parse(fs.readFileSync(defaultRolesFile, 'utf8'));

    console.log(`Atribuindo cargos padrão aos novos membros: ${defaultRoles}`);

    try {
      await member.roles.add(defaultRoles);
      console.log(`Cargos atribuídos a ${member.user.tag}`);
    } catch (error) {
      console.error(`Erro ao atribuir cargos ao membro ${member.user.tag}:`, error);
    }
  } else {
    console.log('Nenhum cargo padrão configurado.');
  }
});

client.login(token);