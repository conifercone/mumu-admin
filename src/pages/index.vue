<template>
  <v-container class="pa-6" fluid>
    <!-- Header Section -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card
          class="mb-6 h-100 d-flex flex-column justify-center"
          elevation="0"
          rounded="lg"
          style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          "
        >
          <v-card-item>
            <v-card-title class="text-h4 font-weight-bold mb-2">
              {{ $t('dashboard.welcomeTitle') }}
            </v-card-title>
            <v-card-subtitle
              class="text-subtitle-1 opacity-90"
              style="color: white !important"
            >
              {{ $t('dashboard.welcomeSubtitle') }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div class="d-flex align-center mt-4">
              <v-btn
                class="me-3 text-capitalize"
                color="white"
                elevation="2"
                style="color: #764ba2"
                variant="elevated"
              >
                {{ $t('dashboard.viewReports') }}
              </v-btn>
              <v-btn class="text-capitalize" color="white" variant="outlined">
                {{ $t('dashboard.manageOrders') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card border class="mb-6 h-100" elevation="0" rounded="lg">
          <v-card-item>
            <div class="d-flex justify-space-between align-center">
              <v-card-title class="text-h6">{{
                $t('dashboard.performance')
              }}</v-card-title>
              <v-icon color="grey" icon="mdi-dots-vertical"></v-icon>
            </div>

            <div class="d-flex flex-column align-center justify-center py-4">
              <div class="text-h3 font-weight-bold text-primary">82%</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                {{ $t('dashboard.weeklyGoal') }}
              </div>
            </div>

            <v-progress-linear
              class="mt-2"
              color="primary"
              height="10"
              model-value="82"
              rounded
              striped
            ></v-progress-linear>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row>
      <v-col v-for="(stat, i) in stats" :key="i" cols="12" md="3" sm="6">
        <v-card
          border
          class="h-100 transition-swing"
          elevation="0"
          rounded="lg"
        >
          <v-card-item>
            <div class="d-flex justify-space-between align-start mb-4">
              <v-avatar
                :color="stat.color"
                rounded="lg"
                size="48"
                variant="tonal"
              >
                <v-icon :icon="stat.icon" size="24"></v-icon>
              </v-avatar>
              <div class="d-flex align-center">
                <span
                  class="text-caption font-weight-bold me-1"
                  :class="stat.trend > 0 ? 'text-success' : 'text-error'"
                >
                  {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                </span>
                <v-icon
                  :color="stat.trend > 0 ? 'success' : 'error'"
                  :icon="stat.trend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                  size="small"
                ></v-icon>
              </div>
            </div>

            <div class="text-h5 font-weight-bold mb-1">{{ stat.value }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ $t(stat.title) }}
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
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
