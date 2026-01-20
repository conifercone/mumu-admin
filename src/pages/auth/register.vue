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
          {{ $t('auth.registerTitle') }}
        </h5>
        <p class="mb-0">
          {{ $t('auth.registerSubtitle') }}
        </p>
      </v-card-text>

      <v-card-text>
        <v-form @submit.prevent="() => {}">
          <v-row>
            <!-- Username -->
            <v-col class="pb-0" cols="12">
              <v-text-field
                v-model="form.username"
                color="primary"
                density="comfortable"
                :label="$t('auth.username')"
                placeholder="johndoe"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
              />
            </v-col>

            <!-- Email -->
            <v-col class="pb-0" cols="12">
              <v-text-field
                v-model="form.email"
                color="primary"
                density="comfortable"
                :label="$t('auth.email')"
                placeholder="johndoe@email.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
              />
            </v-col>

            <!-- Password -->
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                color="primary"
                density="comfortable"
                :label="$t('auth.password')"
                placeholder="············"
                prepend-inner-icon="mdi-lock-outline"
                :type="isPasswordVisible ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- Privacy Policy Checkbox -->
              <div class="d-flex align-center mt-1 mb-4">
                <v-checkbox
                  v-model="form.privacyPolicies"
                  class="me-3"
                  density="compact"
                  hide-details
                  inline
                >
                  <template #label>
                    <span class="me-1">{{ $t('auth.agree') }}</span>
                    <a class="text-primary" href="javascript:void(0)">
                      {{ $t('auth.privacy') }}
                    </a>
                  </template>
                </v-checkbox>
              </div>

              <!-- Signup Button -->
              <v-btn block color="primary" size="large" type="submit">
                {{ $t('auth.signup') }}
              </v-btn>
            </v-col>

            <!-- Login Link -->
            <v-col class="text-center text-base" cols="12">
              <span>{{ $t('auth.alreadyUser') }}</span>
              <router-link class="text-primary ms-2" to="/auth/login">
                {{ $t('auth.signIn') }}
              </router-link>
            </v-col>

            <v-col class="d-flex align-center" cols="12">
              <v-divider />
              <span class="mx-4 text-high-emphasis">{{ $t('auth.or') }}</span>
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
import logo from '@/assets/logo.svg';

const form = reactive({
  username: '',
  email: '',
  password: '',
  privacyPolicies: false,
});

const isPasswordVisible = ref(false);
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
