<template>
  <v-container class="fill-height pa-6 bg-grey-lighten-5" fluid>
    <v-row class="fill-height" dense>
      <v-col cols="12">
        <div class="d-flex flex-column h-100 gap-4">
          <!-- 1. Action & Filter Bar -->
          <v-card class="rounded-xl pa-4" elevation="0" flat>
            <v-row align="center" class="gy-4">
              <!-- Search Group -->
              <v-col
                class="d-flex flex-wrap align-center gap-4"
                cols="12"
                md="auto"
              >
                <v-text-field
                  v-model="filters.code"
                  bg-color="grey-lighten-5"
                  class="search-field"
                  density="comfortable"
                  flat
                  hide-details
                  :label="$t('permission.code')"
                  min-width="220"
                  prepend-inner-icon="mdi-magnify"
                  rounded="lg"
                  variant="solo-filled"
                  @keyup.enter="refresh"
                  @compositionstart="onCompositionStart"
                  @compositionend="isComposing = false"
                ></v-text-field>

                <v-text-field
                  v-model="filters.name"
                  bg-color="grey-lighten-5"
                  class="search-field"
                  density="comfortable"
                  flat
                  hide-details
                  :label="$t('permission.name')"
                  min-width="280"
                  prepend-inner-icon="mdi-filter-variant"
                  rounded="lg"
                  variant="solo-filled"
                  @keyup.enter="refresh"
                  @compositionstart="onCompositionStart"
                  @compositionend="isComposing = false"
                ></v-text-field>
              </v-col>

              <!-- View Mode Toggle -->
              <v-col class="d-flex align-center" cols="auto">
                <v-btn-toggle
                  v-model="viewMode"
                  class="view-mode-toggle rounded-lg bg-grey-lighten-5 pa-1"
                  color="primary"
                  density="compact"
                  mandatory
                  variant="text"
                >
                  <v-btn class="rounded-lg px-4" height="36" value="flat">
                    <v-icon start size="18">mdi-view-list</v-icon>
                    <span class="text-button font-weight-bold">列表</span>
                    <v-tooltip activator="parent" location="top"
                      >平铺模式</v-tooltip
                    >
                  </v-btn>
                  <v-btn class="rounded-lg px-4" height="36" value="tree">
                    <v-icon start size="18">mdi-file-tree</v-icon>
                    <span class="text-button font-weight-bold">树级</span>
                    <v-tooltip activator="parent" location="top"
                      >层级模式</v-tooltip
                    >
                  </v-btn>
                </v-btn-toggle>
              </v-col>

              <v-spacer class="d-none d-md-flex"></v-spacer>

              <!-- Actions Group -->
              <v-col class="d-flex align-center gap-3" cols="12" sm="auto">
                <v-btn
                  class="text-none font-weight-bold px-5 flex-grow-1 flex-sm-grow-0"
                  color="primary"
                  elevation="0"
                  height="44"
                  :loading="downloading"
                  prepend-icon="mdi-tray-arrow-down"
                  rounded="lg"
                  variant="tonal"
                  @click="handleDownload"
                >
                  {{ $t('common.download') }}
                </v-btn>
                <v-btn
                  class="text-none font-weight-bold px-6 flex-grow-1 flex-sm-grow-0"
                  color="primary"
                  elevation="0"
                  height="44"
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
              item-value="treeKey"
              :items="serverItems"
              :items-length="totalItems"
              :loading="loading"
              :select-props="{
                menuProps: {
                  contentClass: 'pagination-select-menu',
                  offset: 8,
                },
              }"
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
                <!-- 1. Normal Row -->
                <tr
                  v-if="!item.isLoadMore"
                  class="table-row-hover"
                  :class="{
                    'child-level-row': (item as any).level > 0,
                    'drop-target': dropTargetId === item.id,
                  }"
                  :draggable="viewMode === 'tree'"
                  @dragstart="onDragStart($event, item)"
                  @dragover="onDragOver($event, item)"
                  @dragleave="onDragLeave"
                  @drop="onDrop($event, item)"
                >
                  <td class="ps-4">
                    <div
                      class="d-flex align-center"
                      :style="{ paddingLeft: (item as any).level * 32 + 'px' }"
                    >
                      <!-- Indent Guide -->
                      <div
                        v-if="(item as any).level > 0"
                        class="indent-guide"
                      ></div>

                      <!-- Expand Button (Tree Mode Only) -->
                      <v-btn
                        v-if="viewMode === 'tree'"
                        class="me-1"
                        :class="{ 'rotate-90': expandedIds.has(item.treeKey) }"
                        color="grey-darken-1"
                        density="compact"
                        :icon="
                          loadingChildren.has(item.treeKey)
                            ? 'mdi-loading mdi-spin'
                            : 'mdi-chevron-right'
                        "
                        size="small"
                        variant="text"
                        @click.stop="toggleExpand(item)"
                      ></v-btn>

                      <v-chip
                        class="font-weight-bold letter-spacing-0"
                        :color="
                          (item as any).level > 0 ? 'secondary' : 'primary'
                        "
                        label
                        size="small"
                        variant="tonal"
                      >
                        {{ item.code }}
                      </v-chip>
                    </div>
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
                  <td class="text-end pe-6">
                    <div class="d-flex align-center justify-end gap-2">
                      <!-- 1. Hierarchy Operations Group -->
                      <div
                        v-if="viewMode === 'tree'"
                        class="d-flex align-center bg-grey-lighten-5 rounded-pill px-2 me-2"
                        style="height: 36px"
                      >
                        <v-btn
                          color="primary"
                          density="compact"
                          icon
                          width="32"
                          height="32"
                          variant="text"
                          @click="openLinkDialog(item)"
                        >
                          <v-icon size="18">mdi-link-variant-plus</v-icon>
                          <v-tooltip activator="parent" location="top"
                            >添加子权限</v-tooltip
                          >
                        </v-btn>

                        <v-btn
                          v-if="item.parentId"
                          color="warning"
                          density="compact"
                          icon
                          width="32"
                          height="32"
                          variant="text"
                          :loading="processingRelation.has(item.treeKey)"
                          @click="handleUnlink(item)"
                        >
                          <v-icon size="18">mdi-link-variant-off</v-icon>

                          <v-tooltip activator="parent" location="top"
                            >解除关系</v-tooltip
                          >
                        </v-btn>
                      </div>

                      <!-- 2. Standard Operations Group (Flat Mode Only) -->

                      <div
                        v-if="viewMode === 'flat'"
                        class="d-flex align-center"
                      >
                        <v-btn
                          class="me-1"
                          color="grey-darken-1"
                          density="compact"
                          icon
                          size="small"
                          variant="text"
                          @click="handleEdit(item)"
                        >
                          <v-icon size="18">mdi-pencil-outline</v-icon>

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
                          <v-icon size="18">mdi-delete-outline</v-icon>

                          <v-tooltip activator="parent" location="top">{{
                            $t('common.delete')
                          }}</v-tooltip>
                        </v-btn>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- 2. Load More Row -->

                <tr v-else class="child-level-row">
                  <td class="ps-4 py-2" colspan="4">
                    <div
                      class="d-flex align-center"
                      :style="{ paddingLeft: (item as any).level * 32 + 'px' }"
                    >
                      <div class="indent-guide"></div>

                      <v-btn
                        class="text-none font-weight-bold"
                        color="primary"
                        density="compact"
                        :loading="loadingMore.has(item.parentTreeKey)"
                        prepend-icon="mdi-dots-horizontal"
                        rounded="pill"
                        size="small"
                        variant="text"
                        @click="loadMoreChildren(item)"
                      >
                        查看更多子权限...
                      </v-btn>
                    </div>
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
            dialogTitle
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

    <!-- Link Descendant Dialog -->
    <v-dialog v-model="linkDialog" max-width="400px" persistent>
      <v-card class="rounded-xl overflow-hidden">
        <v-card-title class="px-6 py-5 bg-white d-flex align-center border-b">
          <span class="text-h6 font-weight-bold text-grey-darken-3"
            >添加子权限</span
          >
          <v-spacer></v-spacer>
          <v-btn
            color="grey-lighten-1"
            density="compact"
            icon="mdi-close"
            variant="text"
            @click="linkDialog = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">
            选择要添加为 [{{ linkParent?.name }}] 子项的权限
          </div>
          <v-autocomplete
            v-model="selectedDescendantId"
            :items="availablePermissions"
            item-title="name"
            item-value="id"
            :loading="searching"
            placeholder="搜索权限名称"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            color="primary"
            hide-details
            clearable
            @update:search="onSearchPermissions"
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
          >
            <template #item="{ props }">
              <v-list-item v-bind="props"></v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-2">
          <v-spacer></v-spacer>
          <v-btn
            class="text-none rounded-pill px-6"
            variant="text"
            @click="linkDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            class="text-none rounded-pill px-6 ms-2"
            color="primary"
            :disabled="!selectedDescendantId"
            :loading="linking"
            variant="flat"
            @click="confirmLink"
          >
            确认添加
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  addPermissionDescendant,
  createPermission,
  deletePermission,
  deletePermissionPath,
  downloadAllPermissions,
  findDirectPermissions,
  findRootPermissions,
  getPermissions,
  updatePermission,
  type Permission,
} from '@/api/permission';
import { confirm } from '@/utils/confirm';
import { message } from '@/utils/message';

const { t } = useI18n();

const viewMode = ref<'flat' | 'tree'>('flat');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const loading = ref(false);
const saving = ref(false);
const downloading = ref(false);
const serverItems = ref<any[]>([]);
const expandedIds = ref<Set<string>>(new Set());
const expandedMeta = ref<Map<string, { current: number; total: number }>>(
  new Map(),
);

// Drag and Drop state
const draggedItem = ref<any>(null);
const dropTargetId = ref<number | null>(null);

// Track loading state for specific rows (children)
const loadingChildren = ref<Set<string>>(new Set());
const loadingMore = ref<Set<string>>(new Set());
const processingRelation = ref<Set<string>>(new Set());

// Link Dialog State
const linkDialog = ref(false);
const linkParent = ref<any>(null);
const selectedDescendantId = ref<number | null>(null);
const availablePermissions = ref<Permission[]>([]);
const searching = ref(false);
const linking = ref(false);
const isComposing = ref(false);
let searchTimer: any = null;

async function onSearchPermissions(query: string) {
  if (isComposing.value || !query || query.length < 2) return;

  if (searchTimer) clearTimeout(searchTimer);

  searchTimer = setTimeout(async () => {
    searching.value = true;
    try {
      const res = await getPermissions({
        name: query,
        pageSize: 20,
      });
      const data = res as any;
      const pageData = data.content ? data : data.data || {};
      availablePermissions.value = pageData.content || [];
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      searching.value = false;
    }
  }, 400); // 400ms debounce
}

function onCompositionStart() {
  isComposing.value = true;
}

function onCompositionEnd(e: any) {
  isComposing.value = false;
  // Trigger search with the finalized value after composition ends
  onSearchPermissions(e.target.value);
}

function openLinkDialog(item: any) {
  linkParent.value = item;
  selectedDescendantId.value = null;
  availablePermissions.value = [];
  linkDialog.value = true;
}

async function confirmLink() {
  if (!linkParent.value || !selectedDescendantId.value) return;

  linking.value = true;
  try {
    await addPermissionDescendant({
      ancestorId: linkParent.value.id,
      descendantId: selectedDescendantId.value,
    });
    message.success('子权限添加成功');
    linkDialog.value = false;
    refresh();
  } catch (error) {
    console.error('Failed to link descendant', error);
  } finally {
    linking.value = false;
  }
}

const filters = reactive({
  code: '',
  name: '',
});

// Dialog State
const dialog = ref(false);
const formRef = ref<any>(null);
const editingId = ref<number | null>(null);
const form = reactive({
  code: '',
  name: '',
  description: '',
});

const isEditing = computed(() => editingId.value !== null);
const dialogTitle = computed(() =>
  isEditing.value ? t('common.edit') : t('common.create'),
);

const headers = computed(() => [
  {
    title: t('permission.code'),
    key: 'code',
    align: 'start' as const,
    width: '250px',
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
    if (viewMode.value === 'flat') {
      const res = await getPermissions({
        current: page.value,
        pageSize: itemsPerPage.value,
        code: filters.code || undefined,
        name: filters.name || undefined,
      });

      const data = res as any;
      const pageData = data.content ? data : data.data || {};
      const list = pageData.content || [];

      serverItems.value = list.map((item: any) => ({
        ...item,
        level: 0,
        treeKey: String(item.id),
      }));
      totalItems.value = Number(pageData.totalElements) || 0;

      // Reset tree states when in flat mode
      expandedIds.value.clear();
      expandedMeta.value.clear();
    } else {
      // Tree Mode: Load Roots
      const res = await findRootPermissions();
      const data = res as any;

      // Robust extraction: data.data could be Permission[] or PageResult<Permission>
      const payload = data.data;
      let rootsList: any[] = [];

      if (Array.isArray(payload)) {
        rootsList = payload;
      } else if (payload && Array.isArray(payload.content)) {
        rootsList = payload.content;
      }

      const roots = rootsList.map((item: any) => ({
        ...item,
        level: 0,
        treeKey: `root-${item.id}`,
        hasChildren: true,
      }));
      serverItems.value = roots;
      totalItems.value = roots.length;

      // Reset expansion state when refreshing roots
      expandedIds.value.clear();
      expandedMeta.value.clear();
    }
  } catch (error) {
    console.error('Failed to load permissions', error);
    serverItems.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
}

async function toggleExpand(item: any) {
  if (expandedIds.value.has(item.treeKey)) {
    // Collapse
    expandedIds.value.delete(item.treeKey);
    expandedMeta.value.delete(item.treeKey);
    // Remove all nested children and load-more placeholders
    const index = serverItems.value.findIndex(
      (i) => i.treeKey === item.treeKey,
    );
    if (index === -1) return;

    let removeCount = 0;
    for (let i = index + 1; i < serverItems.value.length; i++) {
      if (serverItems.value[i].level > item.level) {
        removeCount++;
      } else {
        break;
      }
    }
    serverItems.value.splice(index + 1, removeCount);
  } else {
    // Expand - Load first page
    loadingChildren.value.add(item.treeKey);
    try {
      const pageSize = 5; // Use a small page size for child tree levels
      const res = await findDirectPermissions({
        ancestorId: item.id,
        current: 1,
        pageSize,
      });

      const data = res as any;
      const pageData = data.content ? data : data.data || {};
      const total = Number(pageData.totalElements) || 0;
      const children = (pageData.content || []).map((child: any) => ({
        ...child,
        level: item.level + 1,
        parentId: item.id, // Set parentId for children
        treeKey: `${item.treeKey}-${child.id}`,
        isLoadMore: false,
      }));

      const index = serverItems.value.findIndex(
        (i) => i.treeKey === item.treeKey,
      );
      if (index !== -1) {
        // Insert children
        serverItems.value.splice(index + 1, 0, ...children);
        expandedIds.value.add(item.treeKey);
        expandedMeta.value.set(item.treeKey, { current: 1, total });

        // Add "Load More" placeholder if needed
        if (total > children.length) {
          serverItems.value.splice(index + 1 + children.length, 0, {
            id: `load-more-${item.id}`,
            treeKey: `load-more-${item.treeKey}`,
            parentId: item.id,
            parentTreeKey: item.treeKey,
            level: item.level + 1,
            isLoadMore: true,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load children', error);
    } finally {
      loadingChildren.value.delete(item.treeKey);
    }
  }
}

async function loadMoreChildren(parentItem: any) {
  const meta = expandedMeta.value.get(parentItem.parentTreeKey);
  if (!meta || loadingMore.value.has(parentItem.parentTreeKey)) return;

  loadingMore.value.add(parentItem.parentTreeKey);
  try {
    const pageSize = 5;
    const nextPage = meta.current + 1;
    const res = await findDirectPermissions({
      ancestorId: parentItem.parentId,
      current: nextPage,
      pageSize,
    });

    const data = res as any;
    const pageData = data.content ? data : data.data || {};
    const newChildren = (pageData.content || []).map((child: any) => ({
      ...child,
      level: parentItem.level,
      parentId: parentItem.parentId, // Set parentId
      treeKey: `${parentItem.parentTreeKey}-${child.id}`,
      isLoadMore: false,
    }));

    // Find the current "Load More" item index
    const loadMoreIndex = serverItems.value.findIndex(
      (i) => i.treeKey === parentItem.treeKey,
    );

    if (loadMoreIndex !== -1) {
      // Insert new children before the "Load More" item
      serverItems.value.splice(loadMoreIndex, 0, ...newChildren);

      // Update meta
      const loadedSoFar = (nextPage - 1) * pageSize + newChildren.length;
      meta.current = nextPage;

      // Remove "Load More" item if all loaded
      if (loadedSoFar >= meta.total) {
        serverItems.value.splice(loadMoreIndex + newChildren.length, 1);
      }
    }
  } catch (error) {
    console.error('Failed to load more children', error);
  } finally {
    loadingMore.value.delete(parentItem.parentTreeKey);
  }
}
watch(viewMode, () => {
  page.value = 1;
  refresh();
});

watch(
  () => [filters.code, filters.name],
  ([newCode, newName]) => {
    if ((newCode || newName) && viewMode.value === 'tree') {
      viewMode.value = 'flat';
    }
  },
);

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
  editingId.value = null;
  resetForm();
  dialog.value = true;
}

function handleEdit(item: Permission) {
  editingId.value = item.id;
  form.code = item.code;
  form.name = item.name;
  form.description = item.description;
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  resetForm();
}

function resetForm() {
  editingId.value = null;
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
    if (isEditing.value) {
      await updatePermission({ id: editingId.value as number, ...form });
    } else {
      await createPermission(form);
    }
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

// Relationship Management
async function handleUnlink(item: any) {
  if (!item.parentId) return;

  const confirmed = await confirm({
    title: '解除父子关系',
    content: `确定要解除权限 [${item.name}] 与其父权限的关系吗？`,
    confirmText: '解除',
    color: 'warning',
    icon: 'mdi-link-variant-off',
  });

  if (!confirmed) return;

  processingRelation.value.add(item.treeKey);
  try {
    await deletePermissionPath(item.parentId, item.id);
    message.success('已解除父子关系');
    refresh();
  } catch (error) {
    console.error('Failed to unlink permission', error);
  } finally {
    processingRelation.value.delete(item.treeKey);
  }
}

// Drag & Drop Handlers
function onDragStart(event: DragEvent, item: any) {
  if (viewMode.value !== 'tree') return;
  draggedItem.value = item;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
  }
}

function onDragOver(event: DragEvent, item: any) {
  if (!draggedItem.value || draggedItem.value.id === item.id) return;
  // Prevent dropping onto own descendants (simplified check: just level check for now)
  // Real implementation would need a full hierarchy check
  event.preventDefault();
  dropTargetId.value = item.id;
}

function onDragLeave() {
  dropTargetId.value = null;
}

async function onDrop(event: DragEvent, targetItem: any) {
  event.preventDefault();
  const sourceItem = draggedItem.value;
  const targetId = targetItem.id;

  draggedItem.value = null;
  dropTargetId.value = null;

  if (!sourceItem || sourceItem.id === targetId) return;

  const confirmed = await confirm({
    title: '建立父子关系',
    content: `确定要将 [${sourceItem.name}] 设置为 [${targetItem.name}] 的子权限吗？`,
    confirmText: '确认建立',
    color: 'primary',
    icon: 'mdi-link-variant',
  });

  if (!confirmed) return;

  try {
    await addPermissionDescendant({
      ancestorId: targetId,
      descendantId: sourceItem.id,
    });
    message.success('父子关系建立成功');
    refresh();
  } catch (error) {
    console.error('Failed to add descendant', error);
  }
}

async function handleDownload() {
  downloading.value = true;
  try {
    const response = (await downloadAllPermissions()) as any;

    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'permissions.xlsx';

    if (contentDisposition) {
      // Handle both filename and filename* (UTF-8)
      const fileNameStarMatch = contentDisposition.match(
        /filename\*=utf-8''(.+)/i,
      );
      const fileNameMatch = contentDisposition.match(
        /filename="?(.+?)"?(;|$)/i,
      );

      if (fileNameStarMatch && fileNameStarMatch[1]) {
        fileName = decodeURIComponent(fileNameStarMatch[1]);
      } else if (fileNameMatch && fileNameMatch[1]) {
        // Handle potentially encoded filename in older format
        try {
          fileName = decodeURIComponent(fileNameMatch[1]);
        } catch (e) {
          fileName = fileNameMatch[1];
        }
      }
    }

    // Fix for Chinese characters garbling:
    // If it's a CSV, add UTF-8 BOM (\uFEFF)
    const contentType = response.headers['content-type'] || '';
    const isCsv =
      contentType.includes('csv') || fileName.toLowerCase().endsWith('.csv');

    let blobData = response.data;
    if (isCsv && !(blobData instanceof Blob)) {
      // If response.data is string or arraybuffer, prepending BOM
      blobData = new Blob(['\uFEFF', response.data], {
        type: 'text/csv;charset=utf-8;',
      });
    } else if (isCsv && blobData instanceof Blob) {
      blobData = new Blob(['\uFEFF', blobData], {
        type: 'text/csv;charset=utf-8;',
      });
    } else {
      blobData = new Blob([response.data], { type: contentType });
    }

    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success(t('common.downloadSuccess') || 'Download started');
  } catch (error) {
    console.error('Failed to download permissions', error);
    message.error(t('common.downloadFailed') || 'Download failed');
  } finally {
    downloading.value = false;
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

.table-row-hover[draggable='true'] {
  cursor: grab;
}

.table-row-hover[draggable='true']:active {
  cursor: grabbing;
}

.drop-target {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  outline: 2px dashed rgb(var(--v-theme-primary));
  outline-offset: -2px;
}

.rotate-90 {
  transform: rotate(90deg);
}

.v-btn {
  transition: transform 0.2s ease;
}

.child-level-row {
  background-color: rgba(var(--v-theme-background), 0.5);
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.search-field {
  transition: all 0.3s ease;
}

.search-field :deep(.v-field--focused) {
  background-color: white !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1) !important;
}

.view-mode-toggle {
  height: 44px !important;
  display: flex;
  align-items: center;
}

.border-e {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.d-flex {
  position: relative;
}

.indent-guide {
  position: absolute;
  left: -16px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: rgba(var(--v-theme-secondary), 0.2);
}

:deep(.v-field--variant-solo-filled) {
  box-shadow: none;
}

/* Pagination Dropdown Styling */
:deep(.v-data-table-footer .v-select) {
  width: 100px;
  margin-left: 8px;
  margin-right: 8px;
}

:deep(.v-data-table-footer .v-field) {
  border-radius: 8px !important;
  background-color: rgb(var(--v-theme-background)) !important;
  box-shadow: none !important;
  min-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
}

:deep(.v-data-table-footer .v-field__input) {
  min-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
}

:deep(.v-data-table-footer .v-field__outline) {
  display: none !important;
}

:deep(.v-data-table-footer .v-select__selection-text) {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

:deep(.v-data-table-footer .v-field__append-inner) {
  padding-top: 0;
  align-items: center;
}
</style>

<style>
/* Global-level overrides for the specialized pagination menu */
.pagination-select-menu.v-menu .v-overlay__content {
  border-radius: 20px !important;
  border: 1px solid rgba(115, 103, 240, 0.08) !important;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(115, 103, 240, 0.15) !important;
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

.pagination-select-menu .v-list {
  padding: 8px !important;
  background: transparent !important;
}

.pagination-select-menu .v-list-item {
  min-height: 40px !important;
  margin-bottom: 4px !important;
  border-radius: 12px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 0 12px !important;
}

.pagination-select-menu .v-list-item:last-child {
  margin-bottom: 0 !important;
}

.pagination-select-menu .v-list-item:hover {
  background-color: rgba(115, 103, 240, 0.08) !important;
  transform: translateX(4px);
  color: #7367f0 !important;
}

.pagination-select-menu .v-list-item--active {
  background-color: #7367f0 !important;
  color: white !important;
  box-shadow: 0 4px 10px rgba(115, 103, 240, 0.3) !important;
}

.pagination-select-menu .v-list-item--active .v-list-item-title {
  font-weight: 700 !important;
}

.pagination-select-menu .v-list-item-title {
  font-size: 0.875rem !important;
  text-align: center;
}
</style>
