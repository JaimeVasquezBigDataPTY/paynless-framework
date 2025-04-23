import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { Layout } from '@/components/layout/Layout';
import { Alert }   from '@paynless/types/alert';



export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await apiService.getAlerts();
        setAlerts(data || []);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };
    fetchAlerts();
  }, []);

  const handleGenerateSummary = async () => {
    if (alerts.length === 0) return;
  
    console.log('🧠 Sending alerts to AI:', alerts); // 👈 Add this
    setLoading(true);
  
    try {
      const result = await apiService.generateAlertSummary(alerts);
      setSummary(result);
    } catch (err) {
      console.error('❌ AI Summary error:', err);
      setSummary('⚠️ Failed to generate summary.');
    }
  
    setLoading(false);
  };
  

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">📢 Alerts</h1>

        <div className="mb-6">
          <button
            onClick={handleGenerateSummary}
            disabled={loading || alerts.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            {loading ? 'Generating...' : '🧠 Generate AI Summary'}
          </button>

          {summary && (
            <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50 rounded text-sm text-gray-800 shadow-sm whitespace-pre-line">
              <strong>AI Summary:</strong>
              <p className="mt-1">{summary}</p>
            </div>
          )}
        </div>

        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts to display.</p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert, idx) => (
              <li key={idx} className="p-4 border border-gray-200 rounded bg-white shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    <span className="font-bold">{alert.type}</span> for SKU{' '}
                    <span className="text-indigo-600">{alert.sku}</span> at{' '}
                    <span className="text-indigo-600">{alert.store}</span>
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      alert.severity === 'HIGH'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Expected stockout by <strong>{alert.expectedDate}</strong> (Confidence: {alert.confidenceLevel})
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
