import mongoose from 'mongoose';

const BotRoleSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  // Changed to an array of strings to allow multiple roles (e.g. ['VIP', 'guild_Admin'])
  roles: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        const validRoles = ['VIP', 'guild_Admin', 'guild_Coowner'];
        return v.every(role => validRoles.includes(role));
      },
      message: props => `${props.value} contains invalid roles. Must be VIP, guild_Admin, or guild_Coowner.`
    }
  }
}, { timestamps: true });

// Ensures a single configuration record per user per guild
BotRoleSchema.index({ guildId: 1, userId: 1 }, { unique: true });

export default mongoose.model('BotRole', BotRoleSchema);