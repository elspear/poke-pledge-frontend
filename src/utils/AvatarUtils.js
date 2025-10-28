import { avatars } from '../assets/avatars';

// Map roles to specific avatars with meaningful assignments
const roleAvatarMap = {
    'trainer': 'pikachu',     
    'pokemon_center': 'jigglypuff',  
    'safari_park': 'snorlax' 
};

/**
 * get the default avatar ID based on user role
 * @param {string} role - The user's role (trainer, pokemon_center, safari_park)
 * @returns {string} The avatar ID to use
 */
export function getAvatarByRole(role) {
    // If role exists in map, use that avatar, otherwise default to ditto
    return roleAvatarMap[role] || 'ditto';
}

/**
 * this is where we get the full avatar object by ID
 * @param {string} avatarId - The ID of the avatar to get
 * @returns {Object} The avatar object with src and alt properties
 */
export function getAvatarById(avatarId) {
    return avatars.find(avatar => avatar.id === avatarId) || 
           avatars.find(avatar => avatar.id === 'ditto'); // fallback to ditto
}

export default {
    getAvatarByRole,
    getAvatarById
};