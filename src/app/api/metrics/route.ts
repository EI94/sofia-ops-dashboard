import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Endpoint reale di Sofia AI (HTTP interno)
    const sofiaMetricsUrl = 'http://ops.studioimmigrato.com:8000/metrics';
    
    console.log(`🔄 Fetching metrics from: ${sofiaMetricsUrl}`);
    
    // Fetch delle metriche reali da Sofia AI
    const response = await fetch(sofiaMetricsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'Sofia-Dashboard/1.0'
      },
      // Timeout di 10 secondi
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Leggo le metriche Prometheus reali
    const metricsText = await response.text();
    
    console.log(`✅ Metrics fetched successfully, length: ${metricsText.length} chars`);
    
    // Restituisco le metriche Prometheus originali
    return new NextResponse(metricsText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ Error fetching Sofia AI metrics:', error);
    
    // Restituisco errore dettagliato per debugging
    return NextResponse.json({
      error: 'Failed to fetch Sofia AI metrics',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      endpoint: 'http://ops.studioimmigrato.com:8000/metrics'
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

// Configurazione per Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;
