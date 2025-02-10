<script setup>
import { login } from '@/apis/account'
import { ref } from 'vue'

const visible = ref(false)
const form = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
// 必填校验
const rules = {
  required: value => !!value || 'Field is required',
  email: (value) => {
    const pattern = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    return pattern.test(value) || 'Invalid e-mail.'
  },
}
async function onSubmit() {
  if (!form.value)
    return
  loading.value = true
  try {
    await login({ email: email.value, password: password.value })
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
          v-model="email"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          :rules="[rules.required, rules.email]"
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
