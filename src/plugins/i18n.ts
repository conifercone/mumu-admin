import { createI18n } from 'vue-i18n';
import { en, zhHans } from 'vuetify/locale';

const messages = {
  en: {
    auth: {
      login: 'Login',
      welcome: 'Welcome to Mumu Admin! 👋🏻',
      subtitle: 'Please sign-in to your account and start the adventure',
      email: 'Email',
      usernameOrEmail: 'Username or Email',
      password: 'Password',
      remember: 'Remember me',
      forgot: 'Forgot Password?',
      newAccount: 'New on our platform?',
      createAccount: 'Create an account',
      username: 'Username',
      registerTitle: 'Adventure starts here 🚀',
      registerSubtitle: 'Make your app management easy and fun!',
      agree: 'I agree to',
      privacy: 'privacy policy & terms',
      signup: 'Sign up',
      alreadyUser: 'Already have an account?',
      signIn: 'Sign in instead',
      or: 'or',
    },
    menu: {
      dashboard: 'Dashboard',
      accountSettings: 'Account Settings',
    },
    dashboard: {
      welcomeTitle: 'Welcome back, Administrator! 👋',
      welcomeSubtitle: "Here's what's happening with your store today.",
      viewReports: 'View Reports',
      manageOrders: 'Manage Orders',
      performance: 'Performance',
      weeklyGoal: 'Weekly Goal Achieved',
      recentTransactions: 'Recent Transactions',
      stats: {
        totalSales: 'Total Sales',
        newUsers: 'New Users',
        orderVolume: 'Order Volume',
        pendingItems: 'Pending Items',
      },
      table: {
        id: 'ID',
        customer: 'Customer',
        date: 'Date',
        amount: 'Amount',
        status: 'Status',
      },
      status: {
        completed: 'Completed',
        pending: 'Pending',
        failed: 'Failed',
      },
    },
    layout: {
      footer: 'Mumu Admin',
    },
    http: {
      systemError: 'System Error',
      badRequest: 'Bad Request (400)',
      unauthorized: 'Unauthorized, please login again (401)',
      forbidden: 'Access Denied (403)',
      notFound: 'Resource Not Found (404)',
      internalServerError: 'Internal Server Error (500)',
      timeout: 'Request Timeout, please retry later',
      networkError: 'Network Exception',
      unknownError: 'Unknown Error',
      connectionError: 'Network Connection Exception',
    },
    $vuetify: {
      ...en,
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        pageText: '{0}-{1} of {2}',
      },
    },
  },
  zhHans: {
    auth: {
      login: '登录',
      welcome: '欢迎来到 Mumu Admin! 👋🏻',
      subtitle: '请登录您的账号开始管理',
      email: '邮箱',
      usernameOrEmail: '邮箱/用户名',
      password: '密码',
      remember: '记住我',
      forgot: '忘记密码?',
      newAccount: '新用户?',
      createAccount: '创建账号',
      username: '用户名',
      registerTitle: '冒险从这里开始 🚀',
      registerSubtitle: '让应用管理变得轻松有趣！',
      agree: '我同意',
      privacy: '隐私政策和条款',
      signup: '注册',
      alreadyUser: '已经是用户？',
      signIn: '直接登录',
      or: '或',
    },
    menu: {
      dashboard: '仪表盘',
      accountSettings: '账号设置',
    },
    dashboard: {
      welcomeTitle: '欢迎回来, 管理员! 👋',
      welcomeSubtitle: '这是您商店今天的动态。',
      viewReports: '查看报告',
      manageOrders: '管理订单',
      performance: '业绩表现',
      weeklyGoal: '本周目标达成率',
      recentTransactions: '近期交易',
      stats: {
        totalSales: '总销售额',
        newUsers: '新增用户',
        orderVolume: '订单量',
        pendingItems: '待处理项',
      },
      table: {
        id: 'ID',
        customer: '客户',
        date: '日期',
        amount: '金额',
        status: '状态',
      },
      status: {
        completed: '已完成',
        pending: '待处理',
        failed: '已失败',
      },
    },
    layout: {
      footer: 'Mumu Admin',
    },
    http: {
      systemError: '系统错误',
      badRequest: '请求参数错误 (400)',
      unauthorized: '未授权，请重新登录 (401)',
      forbidden: '拒绝访问 (403)',
      notFound: '资源未找到 (404)',
      internalServerError: '服务器内部错误 (500)',
      timeout: '请求超时，请稍后重试',
      networkError: '网络异常',
      unknownError: '未知错误',
      connectionError: '网络连接异常',
    },
    $vuetify: {
      ...zhHans,
      dataIterator: {
        rowsPerPageText: '每页条目数：',
        pageText: '{0}-{1} 共 {2} 条',
      },
    },
  },
};

const i18n = createI18n({
  legacy: false, // Vuetify 不支持 vue-i18n legacy 模式
  locale: 'zhHans',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
