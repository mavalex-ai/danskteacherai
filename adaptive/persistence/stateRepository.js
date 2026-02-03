// Backend2/adaptive/persistence/stateRepository.js

import { getRedisClient } from "./redisClient.js";
import { UserState } from "../state/index.js";

// In-memory fallback
const memoryStore = new Map();

const KEY_PREFIX = "user_state:";

async function loadUserState(userId) {
  const redis = getRedisClient();

  if (redis) {
    const raw = await redis.get(KEY_PREFIX + userId);
    if (raw) {
      const data = JSON.parse(raw);
      return Object.assign(new UserState(userId), data);
    }
  }

  // Fallback to memory
  return memoryStore.get(userId) || null;
}

async function saveUserState(userState) {
  const redis = getRedisClient();
  const key = KEY_PREFIX + userState.userId;
  const data = JSON.stringify(userState.toJSON());

  if (redis) {
    await redis.set(key, data);
  } else {
    memoryStore.set(userState.userId, userState);
  }
}

async function resetUserState(userId) {
  const redis = getRedisClient();

  if (redis) {
    await redis.del(KEY_PREFIX + userId);
  }

  memoryStore.delete(userId);
}

export {
  loadUserState,
  saveUserState,
  resetUserState
};
