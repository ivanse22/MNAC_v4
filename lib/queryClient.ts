
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Los datos se consideran frescos por 1 hora
      staleTime: 1000 * 60 * 60, 
      // Mantener en memoria por 24 horas (Cache Time / GC Time)
      gcTime: 1000 * 60 * 60 * 24, 
      // Reintentar 2 veces si falla la red
      retry: 2,
      // No re-hacer fetch al enfocar la ventana si tenemos datos
      refetchOnWindowFocus: false,
    },
  },
});
