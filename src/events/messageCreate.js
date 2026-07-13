export default {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    await client.commandHandler.handleMessage(message);
  }
};