<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-sm-8 pa-5" elevation="10" max-width="448">
      <v-card-item class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <v-img class="me-2" height="32" :src="logo" width="32" />
          </div>
        </template>

        <v-card-title class="text-2xl font-weight-bold text-primary">
          MUMU-ADMIN
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-2">
        <h5 class="text-h5 mb-1">
          {{ $t('auth.welcome') }}
        </h5>
        <p class="mb-0">
          {{ $t('auth.subtitle') }}
        </p>
      </v-card-text>

      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-row>
            <!-- email -->
            <v-col class="pb-0" cols="12">
              <v-text-field
                v-model="form.email"
                color="primary"
                density="comfortable"
                :label="$t('auth.usernameOrEmail')"
                placeholder="johndoe@email.com"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
              />
            </v-col>

            <!-- password -->
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                color="primary"
                density="comfortable"
                :label="$t('common.password')"
                placeholder="············"
                prepend-inner-icon="mdi-lock-outline"
                :type="isPasswordVisible ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div
                class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4"
              >
                <v-checkbox
                  v-model="form.remember"
                  class="me-3"
                  density="compact"
                  hide-details
                  :label="$t('auth.remember')"
                />

                <a class="text-primary ms-2 mb-1" href="javascript:void(0)">
                  {{ $t('auth.forgot') }}
                </a>
              </div>

              <!-- login button -->
              <v-btn
                block
                color="primary"
                :loading="isLoading"
                size="large"
                type="submit"
              >
                {{ $t('auth.login') }}
              </v-btn>
            </v-col>

            <!-- create account -->
            <v-col class="text-center text-base" cols="12">
              <span>{{ $t('auth.newAccount') }}</span>
              <router-link class="text-primary ms-2" to="/auth/register">
                {{ $t('auth.createAccount') }}
              </router-link>
            </v-col>

            <v-col class="d-flex align-center" cols="12">
              <v-divider />
              <span class="mx-4 text-high-emphasis">{{ $t('common.or') }}</span>
              <v-divider />
            </v-col>

            <v-col class="text-center" cols="12">
              <v-btn
                class="me-2"
                color="#4267b2"
                icon="mdi-facebook"
                variant="text"
              />
              <v-btn
                class="me-2"
                color="#1da1f2"
                icon="mdi-twitter"
                variant="text"
              />
              <v-btn
                class="me-2"
                color="#272727"
                icon="mdi-github"
                variant="text"
              />
              <v-btn color="#db4437" icon="mdi-google" variant="text" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';
import logo from '@/assets/logo.svg';
import { message } from '@/utils/message';

const { t } = useI18n();
const router = useRouter();

const form = reactive({
  email: '', // This maps to username in OAuth2
  password: '',
  remember: false,
});

const isPasswordVisible = ref(false);
const isLoading = ref(false);

async function handleLogin() {
  if (!form.email || !form.password) {
    message.warning(t('common.required'));
    return;
  }

  try {
    isLoading.value = true;
    const res = await login({
      username: form.email,
      password: form.password,
    });

    // The http interceptor returns the response body directly now.
    // It could be a ResponseWrapper (with .successful=true) or a raw object (like TokenResponse).
    // We cast to any to safely check for the property.
    const responseData = res as any;

    // If it's a wrapper, take .data. Otherwise take the object itself.
    const tokenInfo = responseData.successful
      ? responseData.data
      : responseData;

    if (tokenInfo && tokenInfo.access_token) {
      localStorage.setItem('token', tokenInfo.access_token);
      if (tokenInfo.refresh_token) {
        localStorage.setItem('refresh_token', tokenInfo.refresh_token);
      }
      message.success(t('auth.loginSuccess'));
      router.push('/');
    } else {
      message.error(t('auth.loginFailed'));
    }
  } catch (error) {
    // Error is already handled by interceptor (message.error)
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss">
.auth-wrapper {
  min-block-size: 100vh;
  background-color: rgb(var(--v-theme-surface-variant), 0.12);
}

.auth-card {
  z-index: 1 !important;
}
</style>
