import { useQuery } from '@tanstack/react-query';
import { getForecast } from '@paynless/api-client';

export function useForecast(sku: string, store: string, periods: number, enabled: boolean) {
  return useQuery({
    queryKey: ['forecast', sku, store, periods],
    queryFn: () => getForecast(sku, store, periods),
    enabled,
  });
}
