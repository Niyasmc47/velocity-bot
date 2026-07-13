import { Collection } from 'discord.js';
import { logger } from '../utils/logger.js';
import { getPermissionLevel } from '../utils/permissions.js';
import { CommandContext } from './CommandContext.js';
import GuildConfig from '../database/models/GuildConfig.js';
import { config } from '../config/config.js';

// We import our commands statically here to avoid dynamic import path issues across OS environments
import { pingCommand } from '../commands/utility/ping.js';

export class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Collection();
  }

  init() {
    // Register commands into our collection
    const commandList = [pingCommand];
    
    for (const cmd of commandList) {
      this.commands.set(cmd.name, cmd);
      logger.info(`Loaded Command: ${cmd.name}`);
    }
  }

  /**
   * Handles prefix text messages
   */
  async handleMessage(message) {
    if (message.author.bot || !message.guild) return;

    // Fetch custom prefix for this server from database
    let prefix = config.defaultPrefix;
    try {
      const guildSettings = await GuildConfig.findOne({ guildId: message.guild.id });
      if (guildSettings) {
        prefix = guildSettings.prefix;
      }
    } catch (error) {
      logger.error(`Error loading prefix for guild ${message.guild.id}: ${error.message}`);
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = this.commands.get(commandName);
    if (!command) return;

    // Check permissions
    const userPermLevel = await getPermissionLevel(message.guild.id, message.author.id, message.guild.ownerId);
    if (userPermLevel < command.minPermission) {
      return message.reply(`⚠️ You do not have permission to use this command.`);
    }

    const context = new CommandContext(this.client, message, args);
    try {
      await command.execute(context);
    } catch (error) {
      logger.error(`Error executing prefix command ${commandName}: ${error.message}`);
      await message.reply('❌ An error occurred while executing this command.');
    }
  }

  /**
   * Handles Slash Command interactions
   */
  async handleInteraction(interaction) {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    const command = this.commands.get(interaction.commandName);
    if (!command) return;

    // Check permissions
    const userPermLevel = await getPermissionLevel(interaction.guild.id, interaction.user.id, interaction.guild.ownerId);
    if (userPermLevel < command.minPermission) {
      return interaction.reply({ content: `⚠️ You do not have permission to use this command.`, ephemeral: true });
    }

    const context = new CommandContext(this.client, interaction);
    try {
      await command.execute(context);
    } catch (error) {
      logger.error(`Error executing slash command ${interaction.commandName}: ${error.message}`);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ An error occurred while executing this command.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ An error occurred while executing this command.', ephemeral: true });
      }
    }
  }
}