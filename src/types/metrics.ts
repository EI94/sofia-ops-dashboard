// Tipi per le metriche Sofia AI
export interface SofiaMetrics {
  business: {
    new_leads: number;
    lead_growth: number;
    active_conversations: number;
    conversation_growth: number;
    whatsapp_conversations: number;
    voice_conversations: number;
    web_conversations: number;
    total_revenue: number;
    revenue_growth: number;
  };
  performance: {
    response_time: number;
    response_time_change: number;
    throughput: number;
    throughput_change: number;
    error_count: number;
    error_change: number;
  };
  quality: {
    success_rate: number;
    success_rate_change: number;
    error_rate: number;
    error_rate_change: number;
    user_satisfaction: number;
    satisfaction_change: number;
  };
  linguistic: {
    italian_conversations: number;
    english_conversations: number;
    french_conversations: number;
    spanish_conversations: number;
    arabic_conversations: number;
    total_languages: number;
  };
  geographical: {
    italy_users: number;
    europe_users: number;
    usa_users: number;
    other_users: number;
    total_countries: number;
  };
  system: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    uptime: number;
    health_status: number;
    last_backup: string;
  };
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface DashboardConfig {
  refreshInterval: number;
  metricsEndpoint: string;
  theme: 'light' | 'dark';
  language: 'it' | 'en' | 'fr' | 'es' | 'ar';
}
