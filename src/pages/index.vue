<template>
  <v-container class="pa-0" fluid>
    <!-- Header Section -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6" color="primary" elevation="2" theme="dark">
          <v-card-item>
            <v-card-title class="text-h5">
              {{ $t('dashboard.welcomeTitle') }}
            </v-card-title>
            <v-card-subtitle>
              {{ $t('dashboard.welcomeSubtitle') }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div class="d-flex align-center mt-2">
              <v-btn class="me-2" color="white" variant="outlined">{{
                $t('dashboard.viewReports')
              }}</v-btn>
              <v-btn color="white" variant="tonal">{{
                $t('dashboard.manageOrders')
              }}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mb-6 h-100" elevation="2">
          <v-card-item>
            <v-card-title>{{ $t('dashboard.performance') }}</v-card-title>
            <div class="text-h4 font-weight-bold mt-2">82%</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ $t('dashboard.weeklyGoal') }}
            </div>
            <v-progress-linear
              class="mt-4"
              color="success"
              height="8"
              model-value="82"
              rounded
            ></v-progress-linear>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in stats" :key="i">
        <v-card elevation="2">
          <v-card-item>
            <div class="d-flex justify-space-between align-center mb-2">
              <v-avatar :color="stat.color" variant="tonal" rounded>
                <v-icon :icon="stat.icon"></v-icon>
              </v-avatar>
              <v-chip
                size="x-small"
                :color="stat.trend > 0 ? 'success' : 'error'"
                variant="flat"
              >
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
              </v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stat.value }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ $t(stat.title) }}
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const stats = [
  {
    title: 'dashboard.stats.totalSales',
    value: '$24,983',
    icon: 'mdi-currency-usd',
    color: 'primary',
    trend: 12.5,
  },
  {
    title: 'dashboard.stats.newUsers',
    value: '8,521',
    icon: 'mdi-account-group-outline',
    color: 'success',
    trend: 35.2,
  },
  {
    title: 'dashboard.stats.orderVolume',
    value: '1,423',
    icon: 'mdi-cart-outline',
    color: 'warning',
    trend: -2.4,
  },
  {
    title: 'dashboard.stats.pendingItems',
    value: '45',
    icon: 'mdi-package-variant-closed',
    color: 'info',
    trend: 0.8,
  },
];
</script>
