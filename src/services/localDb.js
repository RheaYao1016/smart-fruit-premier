import { STORAGE_KEYS, META_KEY, STORAGE_VERSION } from '@/constants/storageKeys'
import {
  seedUsers,
  seedPosts,
  seedComments,
  seedLikes,
  seedFavorites,
  seedReports,
  seedProductionHistory,
  seedNutritionContent
} from '@/data/seeds'

const defaults = {
  [STORAGE_KEYS.users]: seedUsers,
  [STORAGE_KEYS.session]: null,
  [STORAGE_KEYS.posts]: seedPosts,
  [STORAGE_KEYS.comments]: seedComments,
  [STORAGE_KEYS.likes]: seedLikes,
  [STORAGE_KEYS.favorites]: seedFavorites,
  [STORAGE_KEYS.reports]: seedReports,
  [STORAGE_KEYS.productionHistory]: seedProductionHistory,
  [STORAGE_KEYS.nutritionContent]: seedNutritionContent
}

function readJSON(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallbackValue
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`[localDb] parse failed for ${key}`, error)
    return fallbackValue
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function migrateUserShape(users) {
  if (!Array.isArray(users)) return seedUsers
  return users.map((item) => {
    if (!item) return null
    return {
      id: item.id || `u_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`,
      account: item.account || item.username || '',
      passwordHash: item.passwordHash || item.password || '',
      role: item.role || 'user',
      nickname: item.nickname || item.name || '新用户',
      avatar: item.avatar || '',
      gender: item.gender || '',
      birthday: item.birthday || '',
      region: item.region || item.location || '',
      preference: {
        lowSugar: Boolean(item.preference?.lowSugar),
        highFiber: Boolean(item.preference?.highFiber),
        allergies: Array.isArray(item.preference?.allergies) ? item.preference.allergies : []
      },
      createdAt: item.createdAt || new Date().toISOString()
    }
  }).filter(Boolean)
}

function runMigrations(fromVersion) {
  if (fromVersion >= STORAGE_VERSION) return

  if (fromVersion < 1) {
    const users = readJSON(STORAGE_KEYS.users, [])
    if (users.length) {
      writeJSON(STORAGE_KEYS.users, migrateUserShape(users))
    }
  }
}

function ensureKeys() {
  Object.entries(defaults).forEach(([key, value]) => {
    const existing = localStorage.getItem(key)
    if (existing === null) {
      writeJSON(key, value)
    }
  })

  const users = readJSON(STORAGE_KEYS.users, [])
  if (!Array.isArray(users) || users.length === 0) {
    writeJSON(STORAGE_KEYS.users, seedUsers)
  }

  const nutrition = readJSON(STORAGE_KEYS.nutritionContent, [])
  if (!Array.isArray(nutrition) || nutrition.length === 0) {
    writeJSON(STORAGE_KEYS.nutritionContent, seedNutritionContent)
  }
}

export function initLocalDb() {
  const meta = readJSON(META_KEY, { version: 0, updatedAt: null })
  runMigrations(meta.version || 0)
  ensureKeys()
  writeJSON(META_KEY, { version: STORAGE_VERSION, updatedAt: new Date().toISOString() })
}

export const localDb = {
  get(key, fallback = null) {
    const finalFallback = fallback === null && key in defaults ? defaults[key] : fallback
    return readJSON(key, finalFallback)
  },
  set(key, value) {
    writeJSON(key, value)
  },
  patchArray(key, updater) {
    const current = readJSON(key, [])
    const next = updater(Array.isArray(current) ? current : [])
    writeJSON(key, next)
    return next
  },
  reset() {
    Object.keys(defaults).forEach((key) => {
      writeJSON(key, defaults[key])
    })
    writeJSON(META_KEY, { version: STORAGE_VERSION, updatedAt: new Date().toISOString() })
  }
}
