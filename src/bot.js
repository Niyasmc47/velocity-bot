import { Client, GatewayIntentBits } from 'discord.js';
import { logger } from './utils/logger.js';
import { CommandHandler } from './core/CommandHandler.js';

// Import our events statically to keep the setup cross-platform and fast
import readyEvent from './events/ready.js';
import messageEvent from './events/messageCreate.js';
import interactionEvent from './events/interactionCreate.js';

export class VelocityClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commandHandler = new CommandHandler(this);
  }

  async loadEvents() {
    const events = [readyEvent, messageEvent, interactionEvent];

    for (const event of events) {
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args, this));
      } else {
        this.on(event.name, (...args) => event.execute(...args, this));
      }
      logger.info(`Loaded Event Listener: ${event.name}`);
    }
  }

  async start(token) {
    logger.info('Initializing Velocity Bot components...');
    
    // Initialize our dual command registry
    this.commandHandler.init();

    // Set up event pathways
    await this.loadEvents();

    try {
      await this.login(token);
    } catch (error) {
      logger.error(`Failed to connect client to Discord API: ${error.message}`);
      throw error;
    }
  }
}