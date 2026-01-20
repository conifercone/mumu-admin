<template>
  <v-container class="pa-6" fluid>
    <!-- Filter Card -->
    <v-card border class="mb-6" elevation="0" rounded="lg">
      <v-card-text>
        <v-row density="compact">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.code"
              clearable
              density="comfortable"
              hide-details
              :label="$t('permission.code')"
              prepend-inner-icon="mdi-code-braces"
              variant="outlined"
              @update:model-value="refresh"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.name"
              clearable
              density="comfortable"
              hide-details
              :label="$t('permission.name')"
              prepend-inner-icon="mdi-tag-text-outline"
              variant="outlined"
              @update:model-value="refresh"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex align-center" cols="12" md="4">
            <v-btn
              class="text-capitalize"
              color="primary"
              elevation="0"
              prepend-icon="mdi-magnify"
              variant="elevated"
              @click="refresh"
            >
              {{ $t('common.search') }}
            </v-btn>
            <v-btn
              class="ms-2 text-capitalize"
              color="secondary"
              prepend-icon="mdi-refresh"
              variant="outlined"
              @click="reset"
            >
              {{ $t('common.reset') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card border elevation="0" rounded="lg">
      <v-card-title class="px-6 pt-6">
        {{ $t('permission.list') }}
      </v-card-title>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        class="rounded-lg"
        :headers="headers"
        hover
        item-value="id"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
      >
        <template #item.actions>
          <v-btn color="medium-emphasis" icon size="small" variant="text">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn color="medium-emphasis" icon size="small" variant="text">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
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
  { title: 'ID', key: 'id', align: 'start' as const },
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
