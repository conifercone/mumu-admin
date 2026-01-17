<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-sm-8 pa-5" max-width="448" elevation="10">
      <v-card-item class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <v-img :src="logo" width="32" height="32" class="me-2" />
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
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="form.username"
                :label="$t('auth.username')"
                placeholder="johndoe"
                variant="outlined"
                color="primary"
                density="comfortable"
              />
            </v-col>

            <!-- Email -->
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="form.email"
                :label="$t('auth.email')"
                placeholder="johndoe@email.com"
                variant="outlined"
                color="primary"
                density="comfortable"
              />
            </v-col>

            <!-- Password -->
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                :label="$t('auth.password')"
                placeholder="············"
                variant="outlined"
                color="primary"
                density="comfortable"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- Privacy Policy Checkbox -->
              <div class="d-flex align-center mt-1 mb-4">
                <v-checkbox
                  v-model="form.privacyPolicies"
                  hide-details
                  inline
                  density="compact"
                  class="me-3"
                >
                  <template #label>
                    <span class="me-1">{{ $t('auth.agree') }}</span>
                    <a href="javascript:void(0)" class="text-primary">
                      {{ $t('auth.privacy') }}
                    </a>
                  </template>
                </v-checkbox>
              </div>

              <!-- Signup Button -->
              <v-btn block color="primary" type="submit" size="large">
                {{ $t('auth.signup') }}
              </v-btn>
            </v-col>

            <!-- Login Link -->
            <v-col cols="12" class="text-center text-base">
              <span>{{ $t('auth.alreadyUser') }}</span>
              <router-link class="text-primary ms-2" to="/auth/login">
                {{ $t('auth.signIn') }}
              </router-link>
            </v-col>

            <v-col cols="12" class="d-flex align-center">
              <v-divider />
              <span class="mx-4 text-high-emphasis">{{ $t('auth.or') }}</span>
              <v-divider />
            </v-col>

            <v-col cols="12" class="text-center">
              <v-btn
                icon="mdi-facebook"
                variant="text"
                color="#4267b2"
                class="me-2"
              />
              <v-btn
                icon="mdi-twitter"
                variant="text"
                color="#1da1f2"
                class="me-2"
              />
              <v-btn
                icon="mdi-github"
                variant="text"
                color="#272727"
                class="me-2"
              />
              <v-btn icon="mdi-google" variant="text" color="#db4437" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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
