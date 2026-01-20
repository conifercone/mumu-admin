export interface MenuItem {
  title: string;
  icon: string;
  to: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'menu.dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: '/',
  },
  {
    title: 'menu.accountSettings',
    icon: 'mdi-account-cog-outline',
    to: '/account-settings', // Placeholder
  },
];
