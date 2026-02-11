import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { localDb } from '@/services/localDb'
import { demoHash, verifyDemoPassword } from '@/utils/security'

const SESSION_TTL = 1000 * 60 * 60 * 24 * 7

function normalizeRole(role) {
  if (['admin', 'maintainer', 'user'].includes(role)) return role
  return 'user'
}

export const useAuthStore = defineStore('auth', () => {
  const users = ref(localDb.get(STORAGE_KEYS.users, []))
  const session = ref(localDb.get(STORAGE_KEYS.session, null))

  const currentUser = computed(() => {
    if (!session.value?.userId) return null
    return users.value.find((item) => item.id === session.value.userId) || null
  })

  const isAuthenticated = computed(() => Boolean(currentUser.value && session.value))
  const role = computed(() => currentUser.value?.role || 'guest')

  function saveUsers() {
    localDb.set(STORAGE_KEYS.users, users.value)
  }

  function saveSession() {
    localDb.set(STORAGE_KEYS.session, session.value)
  }

  function hydrateSession() {
    const latest = localDb.get(STORAGE_KEYS.session, null)
    if (!latest) {
      session.value = null
      return
    }
    if (latest.expireAt && new Date(latest.expireAt).getTime() < Date.now()) {
      session.value = null
      saveSession()
      return
    }
    session.value = latest
  }

  function canAccess(roles) {
    if (!Array.isArray(roles) || roles.length === 0) return true
    return roles.includes(role.value)
  }

  function login(account, password) {
    const target = users.value.find((item) => item.account === String(account).trim())
    if (!target) {
      return { success: false, message: '账号不存在' }
    }

    if (!verifyDemoPassword(password, target.passwordHash)) {
      return { success: false, message: '密码错误' }
    }

    session.value = {
      userId: target.id,
      role: target.role,
      expireAt: new Date(Date.now() + SESSION_TTL).toISOString(),
      loginAt: new Date().toISOString()
    }
    saveSession()
    return { success: true, data: target }
  }

  function register(payload) {
    const account = String(payload.account || '').trim()
    const password = String(payload.password || '').trim()
    const nickname = String(payload.nickname || '').trim()
    const avatar = String(payload.avatar || '').trim()

    if (!account || !password || !nickname || !avatar) {
      return { success: false, message: '请填写必填项（账号、密码、昵称、头像）' }
    }

    if (users.value.some((item) => item.account === account)) {
      return { success: false, message: '账号已存在' }
    }

    const next = {
      id: `u_${Date.now()}`,
      account,
      passwordHash: demoHash(password),
      role: normalizeRole(payload.role || 'user'),
      nickname,
      avatar,
      gender: payload.gender || '',
      birthday: payload.birthday || '',
      region: payload.region || '',
      preference: {
        lowSugar: Boolean(payload.preference?.lowSugar),
        highFiber: Boolean(payload.preference?.highFiber),
        allergies: Array.isArray(payload.preference?.allergies) ? payload.preference.allergies : []
      },
      createdAt: new Date().toISOString()
    }

    users.value.unshift(next)
    saveUsers()
    return { success: true, data: next }
  }

  function logout() {
    session.value = null
    saveSession()
  }

  function resetPassword(account, newPassword) {
    const target = users.value.find((item) => item.account === String(account).trim())
    if (!target) {
      return { success: false, message: '账号不存在' }
    }
    target.passwordHash = demoHash(String(newPassword || '').trim())
    saveUsers()
    return { success: true }
  }

  function updateProfile(payload) {
    if (!currentUser.value) return { success: false, message: '未登录' }
    const idx = users.value.findIndex((item) => item.id === currentUser.value.id)
    if (idx < 0) return { success: false, message: '用户不存在' }

    users.value[idx] = {
      ...users.value[idx],
      nickname: payload.nickname ?? users.value[idx].nickname,
      avatar: payload.avatar ?? users.value[idx].avatar,
      gender: payload.gender ?? users.value[idx].gender,
      birthday: payload.birthday ?? users.value[idx].birthday,
      region: payload.region ?? users.value[idx].region,
      preference: {
        ...users.value[idx].preference,
        ...(payload.preference || {})
      }
    }
    saveUsers()
    return { success: true, data: users.value[idx] }
  }

  function updatePreference(preference) {
    return updateProfile({ preference })
  }

  function adminUpsertUser(payload) {
    if (!canAccess(['admin'])) return { success: false, message: '无权限' }

    if (payload.id) {
      const idx = users.value.findIndex((item) => item.id === payload.id)
      if (idx < 0) return { success: false, message: '用户不存在' }
      users.value[idx] = {
        ...users.value[idx],
        ...payload,
        role: normalizeRole(payload.role || users.value[idx].role)
      }
      if (payload.password) {
        users.value[idx].passwordHash = demoHash(payload.password)
      }
      saveUsers()
      return { success: true, data: users.value[idx] }
    }

    if (!payload.account || !payload.password || !payload.nickname) {
      return { success: false, message: '新增用户需要账号、密码、昵称' }
    }

    return register({
      ...payload,
      role: normalizeRole(payload.role || 'user')
    })
  }

  function adminDeleteUser(userId) {
    if (!canAccess(['admin'])) return { success: false, message: '无权限' }
    if (session.value?.userId === userId) return { success: false, message: '不能删除当前登录用户' }
    users.value = users.value.filter((item) => item.id !== userId)
    saveUsers()
    return { success: true }
  }

  hydrateSession()

  return {
    users,
    session,
    currentUser,
    isAuthenticated,
    role,
    hydrateSession,
    canAccess,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    updatePreference,
    adminUpsertUser,
    adminDeleteUser
  }
})
