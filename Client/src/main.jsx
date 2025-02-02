import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserAuthContextProvider from './context/userAuthContextProvider.jsx'
import PlayQuizContextProvider from './context/playQuizContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <UserAuthContextProvider>
    <PlayQuizContextProvider>
      <App />
    </PlayQuizContextProvider>
  </UserAuthContextProvider>,
)
