<template>
  <v-container class="pa-6" fluid>
    <v-row>
      <!-- Left Column: Profile Card -->
      <v-col cols="12" md="4">
        <v-card
          border
          class="h-100 position-relative"
          elevation="0"
          rounded="lg"
        >
          <!-- Cover Banner -->
          <div
            class="rounded-t-lg"
            style="
              height: 140px;
              background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
            "
          ></div>

          <v-card-text class="d-flex flex-column align-center pt-0">
            <!-- Avatar with overlapping border -->
            <v-avatar
              class="mt-n12 border-4 border-surface elevation-2"
              color="surface"
              size="120"
            >
              <v-avatar color="primary" size="112" variant="tonal">
                <v-img v-if="userAvatar" cover :src="userAvatar"></v-img>
                <span v-else class="text-h2 font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
            </v-avatar>

            <!-- User Info -->
            <div class="text-center mt-3 w-100">
              <h3 class="text-h5 font-weight-bold text-high-emphasis">
                {{ form.nickName || form.username }}
              </h3>
              <div class="text-body-2 text-medium-emphasis mb-2">
                {{ form.email }}
              </div>
              <v-chip
                class="font-weight-medium"
                color="success"
                size="small"
                variant="flat"
              >
                {{ $t('user.verified') }}
              </v-chip>
            </div>

            <v-divider class="w-100 my-6"></v-divider>

            <!-- Actions -->
            <div class="d-flex flex-column gap-2 w-100 px-2">
              <v-btn
                block
                class="text-capitalize mb-2"
                color="primary"
                elevation="1"
                prepend-icon="mdi-camera-outline"
                variant="flat"
              >
                {{ $t('user.uploadAvatar') }}
              </v-btn>
              <v-btn
                block
                class="text-capitalize"
                color="secondary"
                prepend-icon="mdi-restore"
                variant="outlined"
              >
                {{ $t('common.reset') }}
              </v-btn>
            </div>

            <div
              class="text-caption text-medium-emphasis mt-4 text-center px-4"
            >
              {{ $t('user.allowedFormat') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column: Details Form -->
      <v-col cols="12" md="8">
        <v-card border class="h-100" elevation="0" rounded="lg">
          <v-card-item class="pb-0 pt-6 px-6">
            <v-card-title class="text-h6 font-weight-bold">
              {{ $t('user.profileDetails') }}
            </v-card-title>
            <v-card-subtitle>
              {{ $t('user.manageInfo') }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="save">
              <!-- Section: Basic Info -->
              <h4
                class="text-subtitle-2 font-weight-bold text-primary mb-4 d-flex align-center"
              >
                <v-icon
                  class="me-2"
                  icon="mdi-account-box-outline"
                  size="small"
                ></v-icon>
                {{ $t('user.basicInfo') }}
              </h4>

              <v-row class="mb-2" dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.username"
                    bg-color="grey-lighten-5"
                    color="primary"
                    density="comfortable"
                    disabled
                    :label="$t('common.username')"
                    prepend-inner-icon="mdi-account"
                    readonly
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.nickName"
                    color="primary"
                    density="comfortable"
                    :label="$t('user.nickName')"
                    prepend-inner-icon="mdi-badge-account-horizontal"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.gender"
                    color="primary"
                    density="comfortable"
                    :items="genderOptions"
                    :label="$t('common.gender')"
                    prepend-inner-icon="mdi-gender-male-female"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.birthday"
                    color="primary"
                    density="comfortable"
                    :label="$t('common.birthday')"
                    prepend-inner-icon="mdi-calendar"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="mb-6 border-opacity-50"></v-divider>

              <!-- Section: Contact -->
              <h4
                class="text-subtitle-2 font-weight-bold text-primary mb-4 d-flex align-center"
              >
                <v-icon
                  class="me-2"
                  icon="mdi-phone-classic"
                  size="small"
                ></v-icon>
                {{ $t('user.contactInfo') }}
              </h4>

              <v-row class="mb-2" dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    color="primary"
                    density="comfortable"
                    :label="$t('common.email')"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="form.phoneCountryCode"
                    color="primary"
                    density="comfortable"
                    :items="countryCodeOptions"
                    :label="$t('common.phoneCode')"
                    variant="outlined"
                  >
                    <template #selection="{ item }">
                      {{ item.value }}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.phone"
                    color="primary"
                    density="comfortable"
                    :label="$t('common.phone')"
                    prepend-inner-icon="mdi-phone"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="mb-6 border-opacity-50"></v-divider>

              <!-- Section: About -->
              <h4
                class="text-subtitle-2 font-weight-bold text-primary mb-4 d-flex align-center"
              >
                <v-icon
                  class="me-2"
                  icon="mdi-text-box-outline"
                  size="small"
                ></v-icon>
                {{ $t('user.aboutMe') }}
              </h4>

              <v-row dense>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.bio"
                    auto-grow
                    color="primary"
                    density="comfortable"
                    :label="$t('user.bio')"
                    :placeholder="$t('user.bioPlaceholder')"
                    rows="3"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-6">
                <v-btn
                  class="text-capitalize me-3"
                  color="secondary"
                  size="large"
                  variant="text"
                  @click="router.back()"
                >
                  {{ $t('common.cancel') }}
                </v-btn>
                <v-btn
                  class="text-capitalize px-8"
                  color="primary"
                  elevation="2"
                  :loading="isSaving"
                  size="large"
                  type="submit"
                >
                  {{ $t('common.saveChanges') }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import MD5 from 'crypto-js/md5';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getCurrentUser, updateAccount, type UserResponse } from '@/api/auth';
import { message } from '@/utils/message';

const { t } = useI18n();
const router = useRouter();

const isSaving = ref(false);
const userId = ref<number | null>(null);

const countryCodeOptions = computed(() => [
  { title: `${t('country.china')} (+86)`, value: '+86' },
  { title: `${t('country.us')} (+1)`, value: '+1' },
  { title: `${t('country.uk')} (+44)`, value: '+44' },
  { title: `${t('country.japan')} (+81)`, value: '+81' },
  { title: `${t('country.france')} (+33)`, value: '+33' },
  { title: `${t('country.germany')} (+49)`, value: '+49' },
  { title: `${t('country.canada')} (+1)`, value: '+1' },
  { title: `${t('country.australia')} (+61)`, value: '+61' },
  { title: `${t('country.india')} (+91)`, value: '+91' },
  { title: `${t('country.russia')} (+7)`, value: '+7' },
  { title: `${t('country.southKorea')} (+82)`, value: '+82' },
  { title: `${t('country.brazil')} (+55)`, value: '+55' },
  { title: `${t('country.italy')} (+39)`, value: '+39' },
  { title: `${t('country.spain')} (+34)`, value: '+34' },
]);

const genderOptions = computed(() => [
  { title: t('gender.MALE'), value: 'MALE' },
  { title: t('gender.FEMALE'), value: 'FEMALE' },
  { title: t('gender.NON_BINARY'), value: 'NON_BINARY' },
  { title: t('gender.GENDER_QUEER'), value: 'GENDER_QUEER' },
  { title: t('gender.GENDER_FLUID'), value: 'GENDER_FLUID' },
  { title: t('gender.AGENDER'), value: 'AGENDER' },
  { title: t('gender.OTHER'), value: 'OTHER' },
  { title: t('gender.PREFER_NOT_TO_SAY'), value: 'PREFER_NOT_TO_SAY' },
]);

const form = reactive({
  username: '',
  nickName: '',
  email: '',
  phone: '',
  phoneCountryCode: '+86',
  gender: undefined as UserResponse['gender'],
  birthday: '',
  bio: '',
  avatarUrl: '',
});

const initials = computed(() => {
  return (form.nickName || form.username || 'A').charAt(0).toUpperCase();
});

const userAvatar = computed(() => {
  if (form.avatarUrl) {
    return form.avatarUrl;
  }
  if (form.email) {
    const hash = MD5(form.email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=mp`;
  }
  return '';
});

async function fetchUserInfo() {
  try {
    const res = await getCurrentUser();
    const responseData = res as any;
    const userData = responseData.successful ? responseData.data : responseData;

    if (userData) {
      userId.value = userData.id;
      form.username = userData.username;
      form.nickName = userData.nickName;
      form.email = userData.email;
      form.phone = userData.phone || '';
      form.phoneCountryCode = userData.phoneCountryCode || '+86';
      form.gender = userData.gender;
      form.birthday = userData.birthday || '';
      form.bio = userData.bio || '';
      form.avatarUrl = userData.avatar?.url || '';
    }
  } catch (error) {
    console.error('Failed to fetch user info', error);
  }
}

async function save() {
  if (!userId.value) return;

  try {
    isSaving.value = true;
    await updateAccount({
      id: userId.value,
      nickName: form.nickName,
      email: form.email,
      phone: form.phone,
      phoneCountryCode: form.phoneCountryCode,
      gender: form.gender,
      birthday: form.birthday,
      bio: form.bio,
    });
    message.success(t('user.saveSuccess'));
  } catch (error) {
    console.error('Failed to save settings', error);
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.border-surface {
  border-color: rgb(var(--v-theme-surface)) !important;
}
.border-4 {
  border-width: 4px !important;
}
</style>
