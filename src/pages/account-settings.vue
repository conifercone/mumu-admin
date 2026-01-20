<template>
  <v-container class="pa-6" fluid>
    <v-card border class="mb-6" elevation="0" rounded="lg">
      <v-card-item>
        <v-card-title class="text-h6">{{
          $t('user.profileDetails')
        }}</v-card-title>
      </v-card-item>

      <v-divider></v-divider>

      <v-card-text>
        <div class="d-flex align-center mb-6">
          <v-avatar
            class="me-6"
            color="primary"
            rounded="lg"
            size="100"
            variant="tonal"
          >
            <v-img v-if="userAvatar" cover :src="userAvatar"></v-img>
            <span v-else class="text-h3">{{ initials }}</span>
          </v-avatar>
          <div>
            <div class="d-flex mb-2">
              <v-btn
                class="text-capitalize me-3"
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
                {{ $t('user.reset') }}
              </v-btn>
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ $t('user.allowedFormat') }}
            </div>
          </div>
        </div>

        <v-divider class="mb-6"></v-divider>

        <v-form @submit.prevent="save">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.username"
                color="primary"
                disabled
                :label="$t('user.username')"
                readonly
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nickName"
                color="primary"
                :label="$t('user.nickName')"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                color="primary"
                :label="$t('user.email')"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                color="primary"
                :label="$t('user.phone')"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.birthday"
                color="primary"
                :label="$t('user.birthday')"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.gender"
                color="primary"
                :items="['MALE', 'FEMALE', 'OTHER']"
                :label="$t('user.gender')"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.bio"
                color="primary"
                :label="$t('user.bio')"
                rows="3"
                variant="outlined"
              ></v-textarea>
            </v-col>
          </v-row>

          <div class="d-flex mt-4">
            <v-btn
              class="me-3 text-capitalize"
              color="primary"
              elevation="0"
              type="submit"
            >
              {{ $t('user.saveChanges') }}
            </v-btn>
            <v-btn class="text-capitalize" color="secondary" variant="outlined">
              {{ $t('user.cancel') }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import MD5 from 'crypto-js/md5';
import { computed, onMounted, reactive } from 'vue';
import { getCurrentUser } from '@/api/auth';
import { message } from '@/utils/message';

const form = reactive({
  username: '',
  nickName: '',
  email: '',
  phone: '',
  gender: undefined as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
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
