import { config } from '../config/config.js';
import BotRole from '../database/models/BotRole.js';

export const PERMISSIONS = {
  guild_Member: 0,
  VIP: 1,
  guild_Admin: 2,
  guild_Coowner: 3,
  guild_Owner: 4,
  bot_Owner: 5,
};

/**
 * Checks a user's bot permission tier in a guild.
 * @param {string} guildId - Discord Guild ID
 * @param {string} userId - Discord User ID
 * @param {string} guildOwnerId - Owner ID of the Guild
 * @returns {Promise<number>} - Numeric value representing permission level (0-5)
 */
export async function getPermissionLevel(guildId, userId, guildOwnerId) {
  // 1. Bot Owner check (Highest power)
  if (userId === config.ownerId) {
    return PERMISSIONS.bot_Owner;
  }

  // Outside server context (e.g., Direct Messages), default to Member
  if (!guildId) {
    return PERMISSIONS.guild_Member;
  }

  // 2. Guild Owner check
  if (userId === guildOwnerId) {
    return PERMISSIONS.guild_Owner;
  }

  // 3. Database lookup for custom server roles
  try {
    const record = await BotRole.findOne({ guildId, userId });
    
    // If they have custom roles, calculate their highest power level
    if (record && record.roles && record.roles.length > 0) {
      let highestLevel = PERMISSIONS.guild_Member;

      for (const roleName of record.roles) {
        const currentLevel = PERMISSIONS[roleName] || PERMISSIONS.guild_Member;
        if (currentLevel > highestLevel) {
          highestLevel = currentLevel;
        }
      }
      return highestLevel;
    }
  } catch (error) {
    // Return safe default if database search fails
    return PERMISSIONS.guild_Member;
  }

  // 4. Default state
  return PERMISSIONS.guild_Member;
}