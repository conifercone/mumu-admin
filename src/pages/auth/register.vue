<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card
      class="auth-card pa-sm-10 pa-6"
      color="surface"
      elevation="24"
      max-width="480"
      rounded="xl"
      width="100%"
    >
      <v-card-item class="justify-center pt-0 pb-6">
        <div class="d-flex flex-column align-center text-center">
          <v-img class="mb-4" contain height="56" :src="logo" width="56" />
          <h2 class="text-h4 font-weight-bold text-primary mb-2">MUMU ADMIN</h2>
          <p class="text-body-1 text-medium-emphasis">
            {{ $t('auth.registerSubtitle') }}
          </p>
        </div>
      </v-card-item>

      <div class="text-center mb-6">
        <h5 class="text-h6 font-weight-semibold">
          {{ $t('auth.registerTitle') }}
        </h5>
      </div>

      <v-card-text class="pa-0">
        <v-form @submit.prevent="() => {}">
          <v-row no-gutters>
            <!-- Username -->
            <v-col class="mb-4" cols="12">
              <v-text-field
                v-model="form.username"
                bg-color="#F4F5FA"
                color="primary"
                density="comfortable"
                hide-details="auto"
                :label="$t('common.username')"
                placeholder="johndoe"
                prepend-inner-icon="mdi-account-outline"
                rounded="lg"
                variant="solo-filled"
              />
            </v-col>

            <!-- Email -->
            <v-col class="mb-4" cols="12">
              <v-text-field
                v-model="form.email"
                bg-color="#F4F5FA"
                color="primary"
                density="comfortable"
                hide-details="auto"
                :label="$t('common.email')"
                placeholder="johndoe@email.com"
                prepend-inner-icon="mdi-email-outline"
                rounded="lg"
                variant="solo-filled"
              />
            </v-col>

            <!-- Password -->
            <v-col class="mb-2" cols="12">
              <v-text-field
                v-model="form.password"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                bg-color="#F4F5FA"
                color="primary"
                density="comfortable"
                hide-details="auto"
                :label="$t('common.password')"
                placeholder="············"
                prepend-inner-icon="mdi-lock-outline"
                rounded="lg"
                :type="isPasswordVisible ? 'text' : 'password'"
                variant="solo-filled"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-col>

            <!-- Privacy Policy -->
            <v-col class="mb-6" cols="12">
              <v-checkbox
                v-model="form.privacyPolicies"
                color="primary"
                density="compact"
                hide-details
              >
                <template #label>
                  <span class="me-1 text-body-2">{{ $t('auth.agree') }}</span>
                  <a
                    class="text-primary text-decoration-none font-weight-medium text-body-2"
                    href="javascript:void(0)"
                  >
                    {{ $t('auth.privacy') }}
                  </a>
                </template>
              </v-checkbox>
            </v-col>

            <!-- Signup Button -->
            <v-col class="mb-6" cols="12">
              <v-btn
                block
                color="primary"
                elevation="4"
                height="48"
                rounded="lg"
                size="large"
                type="submit"
                class="font-weight-bold"
              >
                {{ $t('auth.signup') }}
              </v-btn>
            </v-col>

            <!-- Login Link -->
            <v-col class="text-center text-body-2 mb-6" cols="12">
              <span class="text-medium-emphasis me-1">
                {{ $t('auth.alreadyUser') }}
              </span>
              <router-link
                class="text-primary font-weight-bold text-decoration-none"
                to="/auth/login"
              >
                {{ $t('auth.signIn') }}
              </router-link>
            </v-col>

            <!-- Divider -->
            <v-col class="d-flex align-center mb-6" cols="12">
              <v-divider />
              <span
                class="mx-4 text-caption text-uppercase text-medium-emphasis"
              >
                {{ $t('common.or') }}
              </span>
              <v-divider />
            </v-col>

            <!-- Social Buttons -->
            <v-col class="d-flex justify-center gap-4" cols="12">
              <v-btn
                color="#4267b2"
                icon="mdi-facebook"
                size="large"
                variant="tonal"
              />
              <v-btn
                color="#1da1f2"
                icon="mdi-twitter"
                size="large"
                variant="tonal"
              />
              <v-btn
                color="#272727"
                icon="mdi-github"
                size="large"
                variant="tonal"
              />
              <v-btn
                color="#db4437"
                icon="mdi-google"
                size="large"
                variant="tonal"
              />
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
  background-image: url('@/assets/login.jpg');
  background-size: cover;
  background-position: center;
}

// Add a slight backdrop blur for better focus on card
.auth-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 0;
}

.auth-card {
  z-index: 1 !important;
}

.gap-4 {
  gap: 1rem;
}
</style>
