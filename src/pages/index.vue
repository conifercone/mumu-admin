<template>
  <v-container class="pa-0" fluid>
    <!-- Header Section -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6" color="primary" elevation="2" theme="dark">
          <v-card-item>
            <v-card-title class="text-h5"> Welcome back, Administrator! 👋 </v-card-title>
            <v-card-subtitle> Here's what's happening with your store today. </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div class="d-flex align-center mt-2">
              <v-btn class="me-2" color="white" variant="outlined">View Reports</v-btn>
              <v-btn color="white" variant="tonal">Manage Orders</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mb-6 h-100" elevation="2">
          <v-card-item>
            <v-card-title>Performance</v-card-title>
            <div class="text-h4 font-weight-bold mt-2">82%</div>
            <div class="text-body-2 text-medium-emphasis">Weekly Goal Achieved</div>
            <v-progress-linear class="mt-4" color="success" height="8" model-value="82" rounded></v-progress-linear>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col v-for="(stat, i) in stats" :key="i" cols="12" md="3" sm="6">
        <v-card elevation="2">
          <v-card-item>
            <div class="d-flex justify-space-between align-center mb-2">
              <v-avatar :color="stat.color" rounded variant="tonal">
                <v-icon :icon="stat.icon"></v-icon>
              </v-avatar>
              <v-chip :color="stat.trend > 0 ? 'success' : 'error'" size="x-small" variant="flat">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
              </v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stat.value }}</div>
            <div class="text-caption text-medium-emphasis">{{ stat.title }}</div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Transactions Table -->
    <v-card elevation="2">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>Recent Transactions</v-card-title>
          <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
        </div>
      </v-card-item>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Customer</th>
            <th class="text-left">Date</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <v-tr v-for="item in transactions" :key="item.id">
            <td class="text-medium-emphasis">#{{ item.id }}</td>
            <td>
              <div class="d-flex align-center">
                <v-avatar class="me-2" color="grey-lighten-3" size="32">
                  <span class="text-caption">{{ item.customer.charAt(0) }}</span>
                </v-avatar>
                {{ item.customer }}
              </div>
            </td>
            <td class="text-medium-emphasis">{{ item.date }}</td>
            <td class="font-weight-medium">{{ item.amount }}</td>
            <td>
              <v-chip :color="getStatusColor(item.status)" label size="small">
                {{ item.status }}
              </v-chip>
            </td>
          </v-tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
const stats = [
  { title: 'Total Sales', value: '$24,983', icon: 'mdi-currency-usd', color: 'primary', trend: 12.5 },
  { title: 'New Users', value: '8,521', icon: 'mdi-account-group-outline', color: 'success', trend: 35.2 },
  { title: 'Order Volume', value: '1,423', icon: 'mdi-cart-outline', color: 'warning', trend: -2.4 },
  { title: 'Pending Items', value: '45', icon: 'mdi-package-variant-closed', color: 'info', trend: 0.8 },
];

const transactions = [
  { id: '5089', customer: 'Joseph Wheeler', date: '2025-09-24', amount: '$2,500.00', status: 'Completed' },
  { id: '5090', customer: 'May Lloyd', date: '2025-09-25', amount: '$120.00', status: 'Pending' },
  { id: '5091', customer: 'William Mckinney', date: '2025-09-26', amount: '$980.50', status: 'Failed' },
  { id: '5092', customer: 'Warren Clark', date: '2025-09-27', amount: '$345.00', status: 'Completed' },
  { id: '5093', customer: 'Bessie Cooper', date: '2025-09-28', amount: '$4,200.00', status: 'Completed' },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': { return 'success';
    }
    case 'Pending': { return 'warning';
    }
    case 'Failed': { return 'error';
    }
    default: { return 'grey';
    }
  }
}
</script>