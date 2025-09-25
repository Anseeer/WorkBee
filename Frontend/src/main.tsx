import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.tsx'
import Store from './Store.ts'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UnreadMessageCountProvider } from './components/context/UnreadCountContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={Store} >
        <UnreadMessageCountProvider>
          <App />
        </UnreadMessageCountProvider>
        <ToastContainer />
      </Provider >
    </GoogleOAuthProvider>
  </StrictMode>,
)
