<template>
  <v-container class="pa-6 h-100 bg-grey-lighten-5" fluid>
    <!-- 1. Page Header -->
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h5 font-weight-bold text-high-emphasis">
          {{ $t('permission.title') }}
        </h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ $t('permission.list') }}
        </div>
      </v-col>
      <v-col class="text-right">
        <v-btn
          class="text-capitalize"
          color="primary"
          elevation="2"
          prepend-icon="mdi-plus"
          rounded="lg"
          size="large"
          variant="flat"
          @click="openDialog"
        >
          {{ $t('common.create') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- 2. Search Filter Panel -->
    <v-card class="mb-4" elevation="0" rounded="lg">
      <v-card-text class="pa-5">
        <v-row align="center" dense>
          <!-- Inputs -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.code"
              bg-color="white"
              clearable
              color="primary"
              density="compact"
              hide-details
              :label="$t('permission.code')"
              prepend-inner-icon="mdi-code-braces"
              variant="outlined"
              @keyup.enter="refresh"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.name"
              bg-color="white"
              clearable
              color="primary"
              density="compact"
              hide-details
              :label="$t('permission.name')"
              prepend-inner-icon="mdi-tag-text-outline"
              variant="outlined"
              @keyup.enter="refresh"
            ></v-text-field>
          </v-col>

          <!-- Buttons (Right Aligned) -->
          <v-col
            class="text-right d-flex align-center justify-end"
            cols="12"
            md="6"
          >
            <v-btn
              class="text-capitalize me-3"
              color="secondary"
              prepend-icon="mdi-refresh"
              variant="outlined"
              @click="reset"
            >
              {{ $t('common.reset') }}
            </v-btn>
            <v-btn
              class="text-capitalize"
              color="primary"
              elevation="1"
              prepend-icon="mdi-magnify"
              variant="elevated"
              @click="refresh"
            >
              {{ $t('common.search') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 3. Data Table -->
    <v-card border elevation="0" rounded="lg">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        class="text-body-2"
        density="comfortable"
        :header-props="{
          class:
            'bg-grey-lighten-5 text-uppercase text-caption font-weight-bold text-medium-emphasis',
        }"
        :headers="headers"
        hover
        item-value="id"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
      >
        <!-- Loading Slot -->
        <template #loading>
          <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
        </template>

        <!-- ID Column -->
        <template #item.id="{ item }">
          <span class="text-caption text-disabled font-weight-mono">{{
            item.id
          }}</span>
        </template>

        <!-- Code Column -->
        <template #item.code="{ item }">
          <v-chip
            class="font-weight-bold"
            color="primary"
            label
            size="small"
            variant="tonal"
          >
            {{ item.code }}
          </v-chip>
        </template>

        <!-- Name Column -->
        <template #item.name="{ item }">
          <span class="text-subtitle-2 text-high-emphasis">{{
            item.name
          }}</span>
        </template>

        <!-- Description Column -->
        <template #item.description="{ item }">
          <v-tooltip location="top" :text="item.description || ''">
            <template #activator="{ props }">
              <span
                v-if="item.description"
                v-bind="props"
                class="text-truncate d-inline-block text-medium-emphasis"
                style="max-width: 300px; vertical-align: middle"
              >
                {{ item.description }}
              </span>
              <span v-else class="text-disabled font-italic text-caption"
                >No description</span
              >
            </template>
          </v-tooltip>
        </template>

        <!-- Actions Column -->
        <template #item.actions>
          <div class="d-flex justify-end">
            <!-- Edit Button -->
            <v-tooltip location="top" :text="$t('common.edit')">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="me-1"
                  color="primary"
                  density="comfortable"
                  icon
                  size="small"
                  variant="text"
                >
                  <v-icon size="small">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <!-- Delete Button -->
            <v-tooltip location="top" :text="$t('common.delete')">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="error"
                  density="comfortable"
                  icon
                  size="small"
                  variant="text"
                >
                  <v-icon size="small">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- No Data Slot -->
        <template #no-data>
          <div class="pa-10 text-center">
            <v-icon class="mb-3" color="grey-lighten-2" size="64">
              mdi-file-search-outline
            </v-icon>
            <div class="text-body-1 text-medium-emphasis">
              No permissions found
            </div>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Create Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card elevation="12" rounded="xl">
        <v-card-title
          class="px-6 py-4 d-flex justify-space-between align-center border-b"
        >
          <span class="text-h6 font-weight-bold">{{
            $t('common.create')
          }}</span>
          <v-btn
            color="medium-emphasis"
            density="comfortable"
            icon="mdi-close"
            variant="text"
            @click="closeDialog"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="savePermission">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.code"
                  color="primary"
                  density="comfortable"
                  hint="e.g. USER_VIEW"
                  :label="$t('permission.code')"
                  persistent-hint
                  prepend-inner-icon="mdi-code-braces"
                  required
                  :rules="[(v: string) => !!v || $t('common.required')]"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  color="primary"
                  density="comfortable"
                  :label="$t('permission.name')"
                  placeholder="e.g. View Users"
                  prepend-inner-icon="mdi-tag-text-outline"
                  required
                  :rules="[(v: string) => !!v || $t('common.required')]"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col class="mt-2" cols="12">
                <v-textarea
                  v-model="form.description"
                  auto-grow
                  color="primary"
                  density="comfortable"
                  :label="$t('permission.description')"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  variant="outlined"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn
            class="text-capitalize px-4"
            color="grey-darken-1"
            variant="text"
            @click="closeDialog"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            class="text-capitalize px-6 ms-2"
            color="primary"
            elevation="2"
            :loading="saving"
            variant="flat"
            @click="savePermission"
          >
            {{ $t('common.saveChanges') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  createPermission,
  getPermissions,
  type Permission,
} from '@/api/permission';
import { message } from '@/utils/message';

const { t } = useI18n();

const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const loading = ref(false);
const saving = ref(false);
const serverItems = ref<Permission[]>([]);

const filters = reactive({
  code: '',
  name: '',
});

// Dialog State
const dialog = ref(false);
const formRef = ref<any>(null);
const form = reactive({
  code: '',
  name: '',
  description: '',
});

const headers = computed(() => [
  { title: t('common.id'), key: 'id', align: 'start' as const, width: '100px' },
  {
    title: t('permission.code'),
    key: 'code',
    align: 'start' as const,
    width: '180px',
  },
  {
    title: t('permission.name'),
    key: 'name',
    align: 'start' as const,
    width: '200px',
  },
  {
    title: t('permission.description'),
    key: 'description',
    align: 'start' as const,
  },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'end' as const,
    width: '120px',
  },
]);

async function loadItems() {
  loading.value = true;
  try {
    const res = await getPermissions({
      current: page.value,
      pageSize: itemsPerPage.value,
      code: filters.code || undefined,
      name: filters.name || undefined,
    });

    const data = res as any;
    const pageData = data.content ? data : data.data || {};

    serverItems.value = pageData.content || [];
    totalItems.value = Number(pageData.totalElements) || 0;
  } catch (error) {
    console.error('Failed to load permissions', error);
  } finally {
    loading.value = false;
  }
}

function refresh() {
  page.value = 1;
  loadItems();
}

function reset() {
  filters.code = '';
  filters.name = '';
  refresh();
}

// Dialog Logic
function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  resetForm();
}

function resetForm() {
  form.code = '';
  form.name = '';
  form.description = '';
  if (formRef.value) {
    formRef.value.reset();
  }
}

async function savePermission() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  saving.value = true;
  try {
    await createPermission(form);
    message.success(t('user.saveSuccess'));
    closeDialog();
    refresh();
  } catch (error) {
    console.error('Failed to save permission', error);
  } finally {
    saving.value = false;
  }
}
</script>
