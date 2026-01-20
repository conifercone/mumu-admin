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
    title: 'menu.permissions',
    icon: 'mdi-shield-lock-outline',
    to: '/permissions',
  },
];
