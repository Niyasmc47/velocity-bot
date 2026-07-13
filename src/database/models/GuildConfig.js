import mongoose from 'mongoose';
import { config } from '../../config/config.js';

const GuildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: config.defaultPrefix },
}, { timestamps: true });

export default mongoose.model('GuildConfig', GuildConfigSchema);