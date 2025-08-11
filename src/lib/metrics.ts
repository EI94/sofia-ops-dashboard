import { SofiaMetrics } from '@/types/metrics';

/**
 * Fetch metrics from Prometheus endpoint
 */
export async function fetchMetrics(endpoint: string): Promise<SofiaMetrics> {
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    return parsePrometheusMetrics(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw new Error(`Failed to fetch metrics from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse Prometheus metrics format
 */
function parsePrometheusMetrics(metricsText: string): SofiaMetrics {
  const lines = metricsText.split('\n');
  const metrics: Partial<SofiaMetrics> = {
    business: {},
    performance: {},
    quality: {},
    linguistic: {},
    geographical: {},
    system: {}
  };

  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') continue;
    
    const match = line.match(/^(\w+)(?:\{([^}]*)\})?\s+([0-9.-]+)/);
    if (!match) continue;
    
    const [, metricName, labels, value] = match;
    const numValue = parseFloat(value);
    
    // Map Prometheus metrics to our structure
    switch (metricName) {
      case 'sofia_new_leads_total':
        metrics.business!.new_leads = numValue;
        break;
      case 'sofia_active_conversations':
        metrics.business!.active_conversations = numValue;
        break;
      case 'sofia_response_time_seconds':
        metrics.performance!.response_time = numValue * 1000; // Convert to ms
        break;
      case 'sofia_error_rate':
        metrics.quality!.error_rate = numValue;
        break;
      case 'sofia_success_rate':
        metrics.quality!.success_rate = numValue;
        break;
      case 'sofia_cpu_usage':
        metrics.system!.cpu_usage = numValue;
        break;
      case 'sofia_memory_usage':
        metrics.system!.memory_usage = numValue;
        break;
      case 'sofia_uptime_seconds':
        metrics.system!.uptime = numValue / 3600; // Convert to hours
        break;
    }
  }

  // Validate that we have all required metrics
  const requiredMetrics = [
    'business.new_leads', 'business.active_conversations',
    'performance.response_time', 'quality.error_rate', 'quality.success_rate',
    'system.cpu_usage', 'system.memory_usage', 'system.uptime'
  ];

  const missingMetrics = requiredMetrics.filter(path => {
    const keys = path.split('.');
    let value = metrics;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as any)[key];
      } else {
        return true;
      }
    }
    return false;
  });

  if (missingMetrics.length > 0) {
    throw new Error(`Metriche mancanti: ${missingMetrics.join(', ')}`);
  }

  // Fill missing optional metrics with 0
  return {
    business: {
      new_leads: metrics.business!.new_leads || 0,
      lead_growth: metrics.business!.lead_growth || 0,
      active_conversations: metrics.business!.active_conversations || 0,
      conversation_growth: metrics.business!.conversation_growth || 0,
      whatsapp_conversations: metrics.business!.whatsapp_conversations || 0,
      voice_conversations: metrics.business!.voice_conversations || 0,
      web_conversations: metrics.business!.web_conversations || 0,
      total_revenue: metrics.business!.total_revenue || 0,
      revenue_growth: metrics.business!.revenue_growth || 0
    },
    performance: {
      response_time: metrics.performance!.response_time || 0,
      response_time_change: metrics.performance!.response_time_change || 0,
      throughput: metrics.performance!.throughput || 0,
      throughput_change: metrics.performance!.throughput_change || 0,
      error_count: metrics.performance!.error_count || 0,
      error_change: metrics.performance!.error_change || 0
    },
    quality: {
      success_rate: metrics.quality!.success_rate || 0,
      success_rate_change: metrics.quality!.success_rate_change || 0,
      error_rate: metrics.quality!.error_rate || 0,
      error_rate_change: metrics.quality!.error_rate_change || 0,
      user_satisfaction: metrics.quality!.user_satisfaction || 0,
      satisfaction_change: metrics.quality!.satisfaction_change || 0
    },
    linguistic: {
      italian_conversations: metrics.linguistic!.italian_conversations || 0,
      english_conversations: metrics.linguistic!.english_conversations || 0,
      french_conversations: metrics.linguistic!.french_conversations || 0,
      spanish_conversations: metrics.linguistic!.spanish_conversations || 0,
      arabic_conversations: metrics.linguistic!.arabic_conversations || 0,
      total_languages: metrics.linguistic!.total_languages || 0
    },
    geographical: {
      italy_users: metrics.geographical!.italy_users || 0,
      europe_users: metrics.geographical!.europe_users || 0,
      usa_users: metrics.geographical!.usa_users || 0,
      other_users: metrics.geographical!.other_users || 0,
      total_countries: metrics.geographical!.total_countries || 0
    },
    system: {
      cpu_usage: metrics.system!.cpu_usage || 0,
      memory_usage: metrics.system!.memory_usage || 0,
      disk_usage: metrics.system!.disk_usage || 0,
      uptime: metrics.system!.uptime || 0,
      health_status: metrics.system!.health_status || 0,
      last_backup: metrics.system!.last_backup || new Date().toISOString()
    }
  };
}
