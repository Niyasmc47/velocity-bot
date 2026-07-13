import { SlashCommandBuilder } from 'discord.js';
import { PERMISSIONS } from '../../utils/permissions.js';

export const pingCommand = {
  name: 'ping',
  description: 'Replies with connection latency and bot statistics.',
  minPermission: PERMISSIONS.guild_Member, // Level 0: Anyone can use this command
  slashBuilder: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with connection latency and bot statistics.'),

  async execute(context) {
    const wsPing = context.client.ws.ping;
    const serverCount = context.client.guilds.cache.size;

    // Send an initial message to calculate latency
    const sentTime = Date.now();
    const message = await context.reply({ content: '⏳ Calculating latency...', fetchReply: true });
    const apiPing = Date.now() - sentTime;

    await context.reply({
      content: `📶 **Velocity Bot Latency**\n` +
               `• **API Latency:** \`${apiPing}ms\` ⚡\n` +
               `• **WebSocket Latency:** \`${wsPing}ms\` ⚙️\n` +
               `• **Total Servers:** \`${serverCount}\` 🌎`
    });
  }
};