<script setup>
import { passwordLogin } from '@/apis/account'
import router from '@/router/index'
import { ref } from 'vue'

const visible = ref(false)
const form = ref(false)
const username = ref('')
const password = ref('')
const loading = ref(false)
// 必填校验
const rules = {
  required: value => !!value || 'Field is required',
}
async function onSubmit() {
  if (!form.value)
    return
  loading.value = true
  try {
    const token = await passwordLogin({
      username: username.value,
      password: password.value,
      grant_type: import.meta.env.VITE_PASSWORD_GRANT_TYPE,
    })
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_LOCAL_STORAGE_KEY, token.access_token)
    localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_LOCAL_STORAGE_KEY, token.refresh_token)
    await router.push('/home')
  }
  catch (err) {
    console.error(err)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <v-img
      class="mb-4"
      height="150"
      src="@/assets/logo.png"
    />

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <v-form
        v-model="form"
        fast-fail
        @submit.prevent="onSubmit"
      >
        <div class="text-subtitle-1 text-medium-emphasis">
          Account
        </div>

        <v-text-field
          v-model="username"
          density="compact"
          placeholder="Enter your username"
          prepend-inner-icon="mdi-account-circle-outline"
          :rules="[rules.required]"
          variant="outlined"
          clearable
        />

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password

          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forgot login password?</a>
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[rules.required]"
          variant="outlined"
          clearable
          @click:append-inner="visible = !visible"
        />

        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
          </v-card-text>
        </v-card>

        <v-btn
          :loading="loading"
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          type="submit"
          :disabled="!form"
          block
        >
          Log In
        </v-btn>

        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="/register"
            rel="noopener noreferrer"
            target="_blank"
          >
            Sign up now <v-icon icon="mdi-chevron-right" />
          </a>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>
