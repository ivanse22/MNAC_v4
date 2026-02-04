import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App' // Asumiendo que App.tsx está en la raíz src/App.tsx o ../App.tsx dependiendo de tu estructura
import './global.css' // Importación crítica de estilos
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)