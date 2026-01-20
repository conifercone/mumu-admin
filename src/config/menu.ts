export interface MenuItem {
  title: string;
  icon: string;
  to: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: '/',
  },
  {
    title: 'Account Settings',
    icon: 'mdi-account-cog-outline',
    to: '/account-settings', // Placeholder
  },
];
