<template>
  <v-container class="fill-height pa-6 bg-grey-lighten-5" fluid>
    <v-row class="fill-height" dense>
      <v-col cols="12">
        <div class="d-flex flex-column h-100 gap-4">
          <!-- 1. Action & Filter Bar -->
          <v-card class="rounded-xl px-4 py-3" elevation="0" flat>
            <v-row align="center" dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.code"
                  bg-color="grey-lighten-5"
                  density="compact"
                  flat
                  hide-details
                  :label="$t('permission.code')"
                  prepend-inner-icon="mdi-magnify"
                  rounded="lg"
                  variant="solo-filled"
                  @keyup.enter="refresh"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.name"
                  bg-color="grey-lighten-5"
                  density="compact"
                  flat
                  hide-details
                  :label="$t('permission.name')"
                  prepend-inner-icon="mdi-filter-variant"
                  rounded="lg"
                  variant="solo-filled"
                  @keyup.enter="refresh"
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="text-right" cols="auto">
                <v-btn
                  class="text-none font-weight-bold px-6"
                  color="primary"
                  elevation="0"
                  height="40"
                  prepend-icon="mdi-plus"
                  rounded="lg"
                  variant="flat"
                  @click="openDialog"
                >
                  {{ $t('common.create') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <!-- 2. Main Data Table -->
          <v-card
            class="flex-grow-1 rounded-xl overflow-hidden"
            elevation="0"
            flat
          >
            <div class="px-6 py-4 border-b">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h3 class="text-h6 font-weight-bold text-grey-darken-3">
                    {{ $t('permission.list') }}
                  </h3>
                  <div class="text-caption text-grey">
                    {{ $t('permission.description') }}
                  </div>
                </div>
                <v-btn
                  color="grey"
                  density="comfortable"
                  icon="mdi-refresh"
                  variant="text"
                  @click="refresh"
                ></v-btn>
              </div>
            </div>

            <v-data-table-server
              v-model:items-per-page="itemsPerPage"
              v-model:page="page"
              class="bg-transparent"
              density="comfortable"
              fixed-header
              :headers="headers"
              hover
              item-value="id"
              :items="serverItems"
              :items-length="totalItems"
              :loading="loading"
              @update:options="loadItems"
            >
              <template
                #headers="{ columns, isSorted, getSortIcon, toggleSort }"
              >
                <tr class="bg-grey-lighten-5">
                  <template
                    v-for="column in columns"
                    :key="column.key || column.title"
                  >
                    <th
                      class="text-uppercase text-caption font-weight-bold text-grey-darken-1 border-0 py-3"
                      :class="{
                        'text-start': column.align === 'start',
                        'text-end': column.align === 'end',
                        'text-center': column.align === 'center',
                      }"
                      :style="{
                        width: column.width,
                        cursor: column.sortable ? 'pointer' : 'default',
                      }"
                      @click="() => column.sortable && toggleSort(column)"
                    >
                      {{ column.title }}
                      <v-icon v-if="isSorted(column)" size="small">{{
                        getSortIcon(column)
                      }}</v-icon>
                    </th>
                  </template>
                </tr>
              </template>

              <!-- Custom Row -->
              <template #item="{ item }">
                <tr class="table-row-hover">
                  <td class="ps-4">
                    <v-chip
                      class="font-weight-bold letter-spacing-0"
                      color="primary"
                      label
                      size="small"
                      variant="tonal"
                    >
                      {{ item.code }}
                    </v-chip>
                  </td>
                  <td>
                    <span
                      class="text-body-2 font-weight-bold text-grey-darken-3"
                    >
                      {{ item.name }}
                    </span>
                  </td>
                  <td>
                    <div
                      class="text-truncate text-grey-darken-1"
                      style="max-width: 250px"
                    >
                      {{ item.description || '-' }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <v-btn
                      class="me-1"
                      color="grey-darken-1"
                      density="compact"
                      icon
                      size="small"
                      variant="text"
                    >
                      <v-icon size="20">mdi-pencil-outline</v-icon>
                      <v-tooltip activator="parent" location="top">{{
                        $t('common.edit')
                      }}</v-tooltip>
                    </v-btn>
                    <v-btn
                      color="error"
                      density="compact"
                      icon
                      size="small"
                      variant="text"
                      @click="handleDelete(item.id)"
                    >
                      <v-icon size="20">mdi-delete-outline</v-icon>
                      <v-tooltip activator="parent" location="top">{{
                        $t('common.delete')
                      }}</v-tooltip>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table-server>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="480px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card class="rounded-xl overflow-hidden" elevation="10">
        <v-card-title class="px-6 py-5 bg-white d-flex align-center border-b">
          <span class="text-h6 font-weight-bold text-grey-darken-3">{{
            $t('common.create')
          }}</span>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-lighten-1"
            density="compact"
            icon="mdi-close"
            variant="text"
            @click="closeDialog"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="savePermission">
            <v-row dense>
              <v-col cols="12">
                <div
                  class="text-caption font-weight-bold text-grey-darken-1 mb-1"
                >
                  {{ $t('permission.code') }}
                </div>
                <v-text-field
                  v-model="form.code"
                  bg-color="grey-lighten-5"
                  class="rounded-lg"
                  density="comfortable"
                  hide-details="auto"
                  :placeholder="$t('permission.codePlaceholder')"
                  required
                  :rules="[(v: string) => !!v || $t('common.required')]"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>

              <v-col class="mt-4" cols="12">
                <div
                  class="text-caption font-weight-bold text-grey-darken-1 mb-1"
                >
                  {{ $t('permission.name') }}
                </div>
                <v-text-field
                  v-model="form.name"
                  bg-color="grey-lighten-5"
                  class="rounded-lg"
                  density="comfortable"
                  hide-details="auto"
                  :placeholder="$t('permission.namePlaceholder')"
                  required
                  :rules="[(v: string) => !!v || $t('common.required')]"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>

              <v-col class="mt-4" cols="12">
                <div
                  class="text-caption font-weight-bold text-grey-darken-1 mb-1"
                >
                  {{ $t('permission.description') }}
                </div>
                <v-textarea
                  v-model="form.description"
                  bg-color="grey-lighten-5"
                  class="rounded-lg"
                  density="comfortable"
                  hide-details="auto"
                  rows="3"
                  variant="outlined"
                  color="primary"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-2">
          <v-spacer></v-spacer>
          <v-btn
            class="text-none rounded-pill px-6 text-body-2 font-weight-bold"
            color="grey-darken-1"
            height="40"
            variant="text"
            @click="closeDialog"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            class="text-none rounded-pill px-6 ms-2 text-body-2 font-weight-bold"
            color="primary"
            elevation="2"
            height="40"
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
  deletePermission,
  getPermissions,
  type Permission,
} from '@/api/permission';
import { confirm } from '@/utils/confirm';
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
  {
    title: t('permission.code'),
    key: 'code',
    align: 'start' as const,
    width: '150px',
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
    width: '100px',
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
    message.success(t('common.saveSuccess') || 'Saved successfully');
    closeDialog();
    refresh();
  } catch (error) {
    console.error('Failed to save permission', error);
  } finally {
    saving.value = false;
  }
}

async function handleDelete(id: number) {
  const confirmed = await confirm({
    title: t('common.delete'),
    content:
      t('common.deleteConfirm') ||
      'Are you sure you want to delete this permission?',
    confirmText: t('common.delete'),
    color: 'error',
    icon: 'mdi-alert-circle-outline',
  });

  if (!confirmed) return;

  try {
    await deletePermission(id);
    message.success(
      t('common.deleteSuccess') || 'Permission deleted successfully',
    );
    refresh();
  } catch (error) {
    console.error('Failed to delete permission', error);
  }
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.table-row-hover {
  transition: background-color 0.2s ease;
}

.table-row-hover:hover {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}

:deep(.v-field--variant-solo-filled) {
  box-shadow: none;
}

/* Pagination Dropdown Styling */
:deep(.v-data-table-footer .v-select) {
  width: 110px; /* Give it some breathing room */
}

:deep(.v-data-table-footer .v-field) {
  border-radius: 8px !important;
  background-color: rgb(var(--v-theme-background)) !important;
  box-shadow: none !important;
  padding-inline-start: 12px;
}

:deep(.v-data-table-footer .v-field__outline) {
  display: none !important;
}

:deep(.v-data-table-footer .v-select__selection-text) {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
