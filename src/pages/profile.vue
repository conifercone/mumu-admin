<template>
  <v-container class="pa-6" fluid>
    <v-row>
      <!-- Left Column: Profile Card -->
      <v-col cols="12" md="4">
        <v-card border class="h-100 text-center" elevation="0" rounded="lg">
          <v-card-text
            class="d-flex flex-column align-center justify-center py-10"
          >
            <v-avatar
              class="mb-4"
              color="primary"
              rounded="lg"
              size="120"
              variant="tonal"
            >
              <v-img v-if="userAvatar" cover :src="userAvatar"></v-img>
              <span v-else class="text-h2">{{ initials }}</span>
            </v-avatar>

            <h3 class="text-h6 font-weight-bold mb-1">
              {{ form.nickName || form.username }}
            </h3>
            <div class="text-body-2 text-medium-emphasis mb-6">
              {{ form.email }}
            </div>

            <div class="d-flex gap-2 justify-center w-100">
              <v-btn
                class="text-capitalize me-2"
                color="primary"
                elevation="0"
                variant="elevated"
              >
                {{ $t('user.uploadAvatar') }}
              </v-btn>
              <v-btn
                class="text-capitalize"
                color="secondary"
                variant="outlined"
              >
                {{ $t('common.reset') }}
              </v-btn>
            </div>

            <div class="text-caption text-medium-emphasis mt-4">
              {{ $t('user.allowedFormat') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column: Details Form -->
      <v-col cols="12" md="8">
        <v-card border class="h-100" elevation="0" rounded="lg">
          <v-card-item>
            <v-card-title class="text-h6 px-2 pt-2">{{
              $t('user.profileDetails')
            }}</v-card-title>
            <v-card-subtitle class="px-2 pb-2">
              Update your personal information
            </v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="save">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.username"
                    color="primary"
                    density="comfortable"
                    disabled
                    :label="$t('common.username')"
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
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    color="primary"
                    density="comfortable"
                    :label="$t('common.email')"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.phone"
                    color="primary"
                    density="comfortable"
                    :label="$t('common.phone')"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.birthday"
                    color="primary"
                    density="comfortable"
                    :label="$t('common.birthday')"
                    type="date"
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
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.bio"
                    color="primary"
                    density="comfortable"
                    :label="$t('user.bio')"
                    rows="3"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-4">
                <v-btn
                  class="text-capitalize me-3"
                  color="secondary"
                  variant="outlined"
                >
                  {{ $t('common.cancel') }}
                </v-btn>
                <v-btn
                  class="text-capitalize"
                  color="primary"
                  elevation="0"
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
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCurrentUser, type UserResponse } from '@/api/auth';
import { message } from '@/utils/message';

const { t } = useI18n();

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
      form.username = userData.username;
      form.nickName = userData.nickName;
      form.email = userData.email;
      form.phone = userData.phone || '';
      form.gender = userData.gender;
      form.birthday = userData.birthday || '';
      form.bio = userData.bio || '';
      form.avatarUrl = userData.avatar?.url || '';
    }
  } catch (error) {
    console.error('Failed to fetch user info', error);
  }
}

function save() {
  // Placeholder for save logic
  message.success('Settings saved (Mock)');
}

onMounted(() => {
  fetchUserInfo();
});
</script>
