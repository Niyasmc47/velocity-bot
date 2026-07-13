export class CommandContext {
  constructor(client, trigger, args = []) {
    this.client = client;
    this.trigger = trigger; // Can be a Message or ChatInputCommandInteraction
    this.isInteraction = !trigger.content; // If it doesn't have text content, it's a slash command
    this.args = args;

    this.guild = trigger.guild;
    this.channel = trigger.channel;
    this.user = this.isInteraction ? trigger.user : trigger.author;
    this.member = trigger.member;
  }

  /**
   * Unified reply function that handles both message replies and interaction replies/followups.
   */
  async reply(options) {
    const payload = typeof options === 'string' ? { content: options } : options;

    if (this.isInteraction) {
      if (this.trigger.replied || this.trigger.deferred) {
        return await this.trigger.followUp(payload);
      }
      return await this.trigger.reply(payload);
    } else {
      return await this.trigger.reply(payload);
    }
  }
}