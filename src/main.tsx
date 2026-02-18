import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n.ts'
// CSS is compiled separately by Tailwind CLI and loaded via <link> in HTML
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
