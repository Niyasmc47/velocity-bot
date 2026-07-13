export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    await client.commandHandler.handleInteraction(interaction);
  }
};