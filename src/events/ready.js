import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Logged into Discord as ${client.user.tag}`);

    // Register our slash commands with Discord
    try {
      logger.info('Registering application (Slash) commands globally...');
      const commandsData = [];
      
      for (const cmd of client.commandHandler.commands.values()) {
        if (cmd.slashBuilder) {
          commandsData.push(cmd.slashBuilder.toJSON());
        }
      }

      await client.application.commands.set(commandsData);
      logger.info('Application commands registered successfully!');
    } catch (error) {
      logger.error(`Failed to register global slash commands: ${error.message}`);
    }
  }
};