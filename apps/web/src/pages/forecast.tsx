import { useState } from 'react';
import { useForecast } from '../hooks/useForecast';
import { Layout } from '../components/layout/Layout';

export default function ForecastPage() {
  const [sku, setSku] = useState('');
  const [store, setStore] = useState('');
  const [periods, setPeriods] = useState(7);
  const [triggered, setTriggered] = useState(false);

  const { data, isLoading, error } = useForecast(sku, store, periods, triggered);

  const handleRun = () => {
    setTriggered(true);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Run Forecast</h1>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                id="sku"
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="e.g. A100"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">Store</label>
              <input
                id="store"
                value={store}
                onChange={e => setStore(e.target.value)}
                placeholder="e.g. Store-1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="periods" className="block text-sm font-medium text-gray-700 mb-1">Forecast Periods</label>
              <input
                id="periods"
                type="number"
                value={periods}
                onChange={e => setPeriods(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleRun}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Run Forecast
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-semibold">Error: {error.message}</p>
          </div>
        )}

        {/* No Data Alert */}
        {!isLoading && triggered && data?.forecasts?.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">No forecast data found for that SKU/store combination.</p>
          </div>
        )}

        {/* Forecast Results */}
        {data?.forecasts?.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">📈</span> Forecast Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.forecasts as any[]).map((f, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {f.sku} @ {f.store}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {f.weeksUntilStockout} weeks until stockout
                        {f.expectedDate && (
                          <span className="block mt-1">
                            Expected date: <span className="font-medium">{f.expectedDate}</span>
                          </span>
                        )}
                      </p>
                    </div>

                    {f.reorderRecommendation && (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          f.reorderRecommendation.urgency === 'HIGH'
                            ? 'bg-red-100 text-red-600'
                            : f.reorderRecommendation.urgency === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {f.reorderRecommendation.urgency} urgency
                      </span>
                    )}
                  </div>

                  {f.reorderRecommendation && (
                    <div className="mt-4 rounded-md bg-gray-50 p-3 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Reorder Information</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Reorder Qty</p>
                          <p className="font-medium">{f.reorderRecommendation.reorderQuantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Safety Stock</p>
                          <p className="font-medium">{f.reorderRecommendation.safetyStock}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Lead Time</p>
                          <p className="font-medium">{f.reorderRecommendation.leadTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
