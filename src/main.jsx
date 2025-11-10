import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'


createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-h6lu5kq7sum48slv.us.auth0.com"
      clientId="gIa5MyniwfaU3vnUjbIkckftehF0p8qn"
      authorizationParams={{
        audience: "https://dev-h6lu5kq7sum48slv.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }}
    >
    <App />
  </Auth0Provider>,
)