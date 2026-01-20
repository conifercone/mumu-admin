<template>
  <v-container class="pa-6" fluid>
    <v-card border elevation="0" rounded="lg">
      <!-- Header -->
      <v-card-title class="d-flex align-center px-6 py-4">
        <span class="text-h6 font-weight-medium">{{
          $t('permission.list')
        }}</span>
        <v-spacer></v-spacer>
        <v-btn
          class="text-capitalize"
          color="primary"
          elevation="0"
          prepend-icon="mdi-plus"
          variant="elevated"
        >
          {{ $t('common.create') }}
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Filters -->
      <div class="px-6 py-4 bg-surface">
        <v-row align="center" density="compact">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.code"
              clearable
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
              clearable
              density="compact"
              hide-details
              :label="$t('permission.name')"
              prepend-inner-icon="mdi-tag-text-outline"
              variant="outlined"
              @keyup.enter="refresh"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <div class="d-flex gap-2">
              <v-btn
                class="text-capitalize me-2"
                color="primary"
                prepend-icon="mdi-magnify"
                variant="tonal"
                @click="refresh"
              >
                {{ $t('common.search') }}
              </v-btn>
              <v-btn
                class="text-capitalize"
                color="secondary"
                prepend-icon="mdi-refresh"
                variant="tonal"
                @click="reset"
              >
                {{ $t('common.reset') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        density="comfortable"
        :headers="headers"
        hover
        item-value="id"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
      >
        <template #item.actions>
          <div class="d-flex">
            <v-btn
              class="me-1"
              color="medium-emphasis"
              icon
              size="small"
              variant="text"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn color="medium-emphasis" icon size="small" variant="text">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getPermissions, type Permission } from '@/api/permission';

const { t } = useI18n();

const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const loading = ref(false);
const serverItems = ref<Permission[]>([]);

const filters = reactive({
  code: '',
  name: '',
});

const headers = computed(() => [
  { title: t('common.id'), key: 'id', align: 'start' as const },
  { title: t('permission.code'), key: 'code', align: 'start' as const },
  { title: t('permission.name'), key: 'name', align: 'start' as const },
  {
    title: t('permission.description'),
    key: 'description',
    align: 'start' as const,
  },
  // { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]);

async function loadItems() {
  loading.value = true;
  try {
    const res = await getPermissions({
      current: page.value, // 第一页从 1 开始
      pageSize: itemsPerPage.value,
      code: filters.code || undefined,
      name: filters.name || undefined,
    });

    const data = res as any;
    // Handle new PageResult structure: content, totalElements
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
</script>
