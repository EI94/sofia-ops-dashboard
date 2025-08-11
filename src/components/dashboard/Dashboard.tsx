'use client';

import { useState, useEffect } from 'react';
import { SofiaMetrics } from '@/types/metrics';
import { fetchMetrics } from '@/lib/metrics';
import MetricCard from '@/components/metrics/MetricCard';
import PieChart from '@/components/charts/PieChart';
import { Activity, Users, Zap, Shield, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardProps {
  metricsEndpoint?: string;
  refreshInterval?: number;
}

export default function Dashboard({ 
  metricsEndpoint = process.env.NEXT_PUBLIC_METRICS_ENDPOINT,
  refreshInterval = 30000 
}: DashboardProps) {
  const [metrics, setMetrics] = useState<SofiaMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!metricsEndpoint) {
        throw new Error('Endpoint metriche non configurato');
      }
      
      const data = await fetchMetrics(metricsEndpoint);
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'Errore di sincronizzazione dati');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [metricsEndpoint, refreshInterval]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sincronizzazione dati Sofia AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Errore Sincronizzazione Dati</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Riprova Sincronizzazione
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nessun Dato Disponibile</h2>
          <p className="text-gray-600 mb-4">Impossibile recuperare le metriche di Sofia AI</p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Riprova Sincronizzazione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sofia AI Dashboard</h1>
          <p className="text-gray-600">Monitoraggio in tempo reale delle performance e metriche</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Nuovi Lead"
            value={metrics.business.new_leads}
            change={metrics.business.lead_growth}
            icon="Users"
            color="blue"
          />
          <MetricCard
            title="Conversazioni Attive"
            value={metrics.business.active_conversations}
            change={metrics.business.conversation_growth}
            icon="Activity"
            color="green"
          />
          <MetricCard
            title="Tempo di Risposta"
            value={`${metrics.performance.response_time}ms`}
            change={metrics.performance.response_time_change}
            icon="Zap"
            color="yellow"
          />
          <MetricCard
            title="Tasso di Successo"
            value={`${(metrics.quality.success_rate * 100).toFixed(1)}%`}
            change={metrics.quality.success_rate_change}
            icon="TrendingUp"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Distribuzione Conversazioni</h3>
            <PieChart
              data={[
                { name: 'WhatsApp', value: metrics.business.whatsapp_conversations, color: '#25D366' },
                { name: 'Voice', value: metrics.business.voice_conversations, color: '#007AFF' },
                { name: 'Web', value: metrics.business.web_conversations, color: '#FF6B35' }
              ]}
              title="Canali di Comunicazione"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Distribuzione Linguistica</h3>
            <PieChart
              data={[
                { name: 'Italiano', value: metrics.linguistic.italian_conversations, color: '#009246' },
                { name: 'Inglese', value: metrics.linguistic.english_conversations, color: '#012169' },
                { name: 'Francese', value: metrics.linguistic.french_conversations, color: '#ED2939' },
                { name: 'Spagnolo', value: metrics.linguistic.spanish_conversations, color: '#AA151B' },
                { name: 'Arabo', value: metrics.linguistic.arabic_conversations, color: '#000000' }
              ]}
              title="Lingue Supportate"
            />
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Stato Sistema</h3>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Operativo</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.system.cpu_usage}%</div>
              <div className="text-sm text-gray-600">CPU</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.system.memory_usage}%</div>
              <div className="text-sm text-gray-600">Memoria</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.system.uptime.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.system.health_status}</div>
              <div className="text-sm text-gray-600">Stato</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Ultimo aggiornamento: {lastUpdate?.toLocaleString('it-IT')}
        </div>
      </div>
    </div>
  );
}
