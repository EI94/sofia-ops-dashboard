import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Dashboard 
          metricsEndpoint={process.env.NEXT_PUBLIC_METRICS_ENDPOINT}
          refreshInterval={30000}
        />
      </div>
    </main>
  );
}
