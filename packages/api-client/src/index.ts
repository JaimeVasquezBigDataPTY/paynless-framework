// Export API client modules
export * from './apiClient'; // Ensure this points to the correct file
export * from './stripe.api'; 
export * from './ai.api'; // Export AiApiClient 

export async function getForecast(sku: string, store: string, periods: number) {
    const res = await fetch("http://localhost:3001/api/forecast/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, store, periods }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch forecast");
    }
  
    return res.json();
  }
  
  
  