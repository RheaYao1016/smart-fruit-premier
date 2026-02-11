export function demoHash(input) {
  const text = String(input || '')
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return `demo_${Math.abs(hash)}`
}

export function nowIso() {
  return new Date().toISOString()
}

// 注意：仅演示用途，不可用于真实生产环境。
export function verifyDemoPassword(password, passwordHash) {
  return demoHash(password) === passwordHash
}
