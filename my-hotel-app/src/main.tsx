import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, defaultSystem, Toaster, Toast } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { appToaster } from './lib/toaster'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>

      {/* 👇 Το Toaster τώρα έχει και children (renderer) */}
      <Toaster toaster={appToaster}>
        {(toast) => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            {toast.description ? (
              <Toast.Description>{toast.description}</Toast.Description>
            ) : null}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </Toaster>
    </ChakraProvider>
  </React.StrictMode>,
)
