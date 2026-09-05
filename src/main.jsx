import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA: Service Worker'ni ro'yxatdan o'tkazish (Offline va Telefonga o'rnatish uchun)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => console.log('Service Worker muvaffaqiyatli ro\'yxatdan o\'tdi:', reg.scope))
      .catch((err) => console.error('Service Worker xatolik:', err));
  });
}