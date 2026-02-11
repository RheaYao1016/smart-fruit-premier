<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ImageField from '@/components/ImageField.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  account: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  avatar: '',
  gender: '',
  birthday: '',
  region: '',
  role: 'user',
  lowSugar: false,
  highFiber: false,
  allergyInput: '',
  allergies: []
})

const error = ref('')
const success = ref('')

const canSubmit = computed(() => {
  return form.value.account && form.value.password && form.value.nickname && form.value.avatar
})

function addAllergy() {
  const value = form.value.allergyInput.trim()
  if (!value) return
  if (!form.value.allergies.includes(value)) {
    form.value.allergies.push(value)
  }
  form.value.allergyInput = ''
}

function removeAllergy(item) {
  form.value.allergies = form.value.allergies.filter((a) => a !== item)
}

function submit() {
  error.value = ''
  success.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入密码不一致'
    return
  }

  const result = authStore.register({
    account: form.value.account,
    password: form.value.password,
    nickname: form.value.nickname,
    avatar: form.value.avatar,
    gender: form.value.gender,
    birthday: form.value.birthday,
    region: form.value.region,
    role: form.value.role,
    preference: {
      lowSugar: form.value.lowSugar,
      highFiber: form.value.highFiber,
      allergies: form.value.allergies
    }
  })

  if (!result.success) {
    error.value = result.message
    return
  }

  success.value = '注册成功，请登录'
  setTimeout(() => {
    router.push('/login')
  }, 600)
}
</script>

<template>
  <div class="min-h-screen bg-app-bg px-4 py-5">
    <div class="mx-auto max-w-md space-y-4">
      <div class="rounded-3xl border border-amber-100 bg-white p-5 shadow-lg">
        <h1 class="text-xl font-bold text-stone-800">注册账号</h1>
        <p class="mt-1 text-xs text-stone-500">纯前端演示：密码为简单 hash 存储，请勿用于真实生产。</p>

        <div class="mt-4 space-y-3">
          <input v-model="form.account" type="text" placeholder="账号（必填）" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />
          <input v-model="form.password" type="password" placeholder="密码（必填）" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />
          <input v-model="form.confirmPassword" type="password" placeholder="确认密码" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />
          <input v-model="form.nickname" type="text" placeholder="昵称（必填）" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />
          <ImageField v-model="form.avatar" label="头像（必填）" aspect-hint="建议 1:1" />

          <div class="grid grid-cols-2 gap-2">
            <select v-model="form.gender" class="rounded-xl border border-stone-200 px-3 py-2.5">
              <option value="">性别（可选）</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="保密">保密</option>
            </select>
            <input v-model="form.birthday" type="date" class="rounded-xl border border-stone-200 px-3 py-2.5" />
          </div>

          <input v-model="form.region" type="text" placeholder="地区（可选）" class="w-full rounded-xl border border-stone-200 px-3 py-2.5" />

          <select v-model="form.role" class="w-full rounded-xl border border-stone-200 px-3 py-2.5">
            <option value="user">普通用户</option>
            <option value="maintainer">设备维护员</option>
          </select>

          <div class="rounded-2xl border border-stone-200 p-3">
            <p class="text-sm font-medium text-stone-700">偏好设置</p>
            <div class="mt-2 flex flex-wrap gap-3 text-sm">
              <label class="flex items-center gap-2"><input v-model="form.lowSugar" type="checkbox" /> 低糖</label>
              <label class="flex items-center gap-2"><input v-model="form.highFiber" type="checkbox" /> 高纤维</label>
            </div>

            <div class="mt-2 flex gap-2">
              <input v-model="form.allergyInput" type="text" placeholder="过敏源（自定义）" class="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm" />
              <button class="rounded-xl border border-amber-500 px-3 text-sm text-amber-600" @click="addAllergy">添加</button>
            </div>

            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="item in form.allergies"
                :key="item"
                class="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700"
                @click="removeAllergy(item)"
              >
                {{ item }} ×
              </button>
            </div>
          </div>

          <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500">{{ error }}</p>
          <p v-if="success" class="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-600">{{ success }}</p>

          <button class="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white disabled:opacity-60" :disabled="!canSubmit" @click="submit">
            注册
          </button>
        </div>
      </div>

      <button class="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm" @click="router.push('/login')">
        已有账号，返回登录
      </button>
    </div>
  </div>
</template>
