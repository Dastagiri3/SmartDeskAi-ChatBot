export const translations = {
  en: {
    app_name: 'SmartDesk AI',
    tagline: 'AI-powered multilingual IT support',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    language: 'Language',
    dashboard: 'Dashboard',
    new_ticket: 'New Ticket',
    tickets: 'Tickets',
    settings: 'Settings',
    admin_panel: 'Admin Panel',

    total_tickets: 'Total Tickets',
    open_tickets: 'Open Tickets',
    resolved_today: 'Resolved Today',
    avg_response_time: 'Avg Response Time',
    recent_tickets: 'Recent Tickets',

    ticket_id: 'Ticket ID',
    issue_summary: 'Issue Summary',
    status: 'Status',
    submitted_at: 'Submitted At',
    category: 'Category',
    confidence: 'Confidence',

    full_name: 'Full Name',
    email: 'Email',
    issue_description: 'Issue Description',
    submit_ticket: 'Submit Ticket',
    submit: 'Submit',

    ai_analyzing: 'AI is analyzing your issue...',
    ai_resolution: 'AI Resolution',
    mark_resolved: 'Mark as Resolved',
    escalate: 'Escalate to Human',

    status_open: 'Open',
    status_resolved: 'Resolved',
    status_escalated: 'Escalated',

    confidence_high: 'High',
    confidence_medium: 'Medium',
    confidence_low: 'Low',

    category_network: 'Network',
    category_software: 'Software',
    category_hardware: 'Hardware',
    category_access: 'Access/Login',
    category_other: 'Other',

    all_tickets: 'All Tickets',
    filter: 'Filter',
    export_csv: 'Export to CSV',
    escalated_tickets: 'Escalated Tickets',

    user_profile: 'User Profile',
    preferred_language: 'Preferred Language',
    email_notifications: 'Email Notifications',
    save_changes: 'Save Changes',

    no_tickets_yet: 'No tickets yet',
    create_first_ticket: 'Create your first ticket to get started',

    ticket_submitted: 'Ticket submitted successfully',
    ticket_updated: 'Ticket updated successfully',
    profile_updated: 'Profile updated successfully',

    error_occurred: 'An error occurred',
    try_again: 'Please try again',

    welcome_back: 'Welcome back',
    new_user: 'New user?',
    existing_user: 'Already have an account?',
    password: 'Password',
    confirm_password: 'Confirm Password',

    minutes: 'minutes',
  },
  ja: {
    app_name: 'SmartDesk AI',
    tagline: 'AI搭載多言語ITサポート',
    login: 'ログイン',
    signup: '新規登録',
    logout: 'ログアウト',
    language: '言語',
    dashboard: 'ダッシュボード',
    new_ticket: '新規チケット',
    tickets: 'チケット',
    settings: '設定',
    admin_panel: '管理パネル',

    total_tickets: '総チケット数',
    open_tickets: '未解決チケット',
    resolved_today: '本日解決',
    avg_response_time: '平均応答時間',
    recent_tickets: '最近のチケット',

    ticket_id: 'チケットID',
    issue_summary: '問題概要',
    status: 'ステータス',
    submitted_at: '提出日時',
    category: 'カテゴリ',
    confidence: '信頼度',

    full_name: '氏名',
    email: 'メールアドレス',
    issue_description: '問題の詳細',
    submit_ticket: 'チケットを送信',
    submit: '送信',

    ai_analyzing: 'AIが問題を分析しています...',
    ai_resolution: 'AI解決案',
    mark_resolved: '解決済みにする',
    escalate: '人間にエスカレート',

    status_open: '未解決',
    status_resolved: '解決済み',
    status_escalated: 'エスカレート済み',

    confidence_high: '高',
    confidence_medium: '中',
    confidence_low: '低',

    category_network: 'ネットワーク',
    category_software: 'ソフトウェア',
    category_hardware: 'ハードウェア',
    category_access: 'アクセス/ログイン',
    category_other: 'その他',

    all_tickets: '全チケット',
    filter: 'フィルター',
    export_csv: 'CSVエクスポート',
    escalated_tickets: 'エスカレート済みチケット',

    user_profile: 'ユーザープロフィール',
    preferred_language: '優先言語',
    email_notifications: 'メール通知',
    save_changes: '変更を保存',

    no_tickets_yet: 'まだチケットがありません',
    create_first_ticket: '最初のチケットを作成して始めましょう',

    ticket_submitted: 'チケットが正常に送信されました',
    ticket_updated: 'チケットが正常に更新されました',
    profile_updated: 'プロフィールが正常に更新されました',

    error_occurred: 'エラーが発生しました',
    try_again: 'もう一度お試しください',

    welcome_back: 'おかえりなさい',
    new_user: '新規ユーザーですか？',
    existing_user: 'すでにアカウントをお持ちですか？',
    password: 'パスワード',
    confirm_password: 'パスワードの確認',

    minutes: '分',
  },
};

export type Language = 'en' | 'ja';
export type TranslationKey = keyof typeof translations.en;
